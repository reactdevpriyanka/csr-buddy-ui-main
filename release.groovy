FALLBACK_VERSION = '7.0.0'

/**
 * Get the package version from the Jenkins build artifacts.
 * @return {String}
 */
def getPackageVersion() {
  try {
    copyArtifacts(projectName: currentBuild.projectName, selector: lastSuccessful(), optional: true)
    def version = readFile(file: 'version.txt')
    return version.replaceAll("\n", "")
  } catch (Exception ignored) {}

  try {
    copyArtifacts(projectName: 'build-csr-buddy-ui/main')
    def version = readFile(file: 'version.txt')
    return version.replaceAll("\n", "")
  } catch (Exception ignored) {}

  return FALLBACK_VERSION
}

/**
 * Upload the test coverage reports to AWS S3
 * @return {void}
 */
def uploadReports() {
  withAWS(role:'arn:aws:iam::278833423079:role/CHEWY-cross-jenkins') {
    sh """
      aws s3 sync ./coverage s3://shd-use1-ci-test-coverage-reports/CSRB-${env.PUBLISH_VERSION}-unit-test-report
    """
  }
}

/**
 * Set the package version and record it as the `PUBLISH_VERSION` environment variable.
 * @return {void}
 */
def setPackageVersion(String newVersion) {
  env.PUBLISH_VERSION = newVersion
}

def fetchChangesFromBranch(String branch) {
  withCredentials([usernamePassword(credentialsId: 'jenkins-github-userpass', passwordVariable: 'GRGIT_PASS', usernameVariable: 'GRGIT_USER')]) {
    sh "git checkout ${branch}"
    sh "git fetch --update-shallow https://${env.GRGIT_USER}:${env.GRGIT_PASS}@github.com/Chewy-Inc/csr-buddy-ui"
  }
}

/**
 * Get the git log output for the last successful git commit and this current commit
 * @return {String}
 */
def getGitLogOutputFromLastTag() {
  def base = ''
  def commit = ''
  // in the event that we are dealing with a merge we need to use the last
  // successful commit for the analysis
  if (env.GIT_BRANCH in ['main']) {
    fetchChangesFromBranch(env.GIT_BRANCH)
    commit = env.GIT_BRANCH
    base = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
    if (base == null) {
      base = env.GIT_PREVIOUS_COMMIT
    }
  } else {
    if (env.CHANGE_TARGET == null) {
      env.CHANGE_TARGET = 'main'
    }
    if (env.CHANGE_BRANCH == null) {
      env.CHANGE_BRANCH = env.GIT_BRANCH
    }
    fetchChangesFromBranch(env.CHANGE_TARGET)
    fetchChangesFromBranch(env.CHANGE_BRANCH)
    base = env.CHANGE_TARGET
    commit = env.GIT_COMMIT
  }
  return sh(script: "git log ${base}..${commit}", returnStdout: true)
}

def getBranchName() {
  return env.CHANGE_BRANCH != null ? env.CHANGE_BRANCH : env.BRANCH_NAME
}

/**
 * Generate a 'postfix' for a version based on branch name and build number if applicable.
 * Does not generate a postfix for main branch merges.
 *
 * @return {String}
 */
def getPostfixForVersion() {
  def branchName = getBranchName()
  def postfix = ""
  switch (branchName) {
  case "main":
    break
  default:
    def isHotfix = branchName.startsWith('hotfix')
    if (isHotfix) {
      postfix = "-hotfix.b${env.BUILD_NUMBER}"
    } else {
      postfix = "-${branchName.replaceAll("/", "-")}.b${env.BUILD_NUMBER}"
    }
    break
  }
  return postfix
}

/**
 * Set the PUBLISH_VERSION in the Jenkins pipeline based on the analysis.
 * 
 * For a commit with a message of `fix` we anticipate releasing a patch version.
 * For a commit with a message of `feat` we release a new minor version.
 * For commits with a message of `release` we release a new major version.
 *
 * If a major version is expected we set minor and patch versions to 0.
 * If a minor version is expected we set patch version to 0.
 * And finally, for a patch version we simply increment the patch version.
 *
 * @return {void}
 */
def analyzeCommits() {
  def currentVersion = getPackageVersion()
  echo "currentVersion: ${currentVersion}"
  def semver = [false, false, false] // <- major, minor, patch; if the commit matches the regex for one of these set to true
  
  def gitLogOutput = getGitLogOutputFromLastTag()
  def postfix = getPostfixForVersion()
  def commitMessagePattern = /(fix|feat|release|chore)\(([\w-_]+)\):?\s?(.+)/
  def matcher = gitLogOutput =~ commitMessagePattern
  def allMatches = matcher.findAll()
  for (match in allMatches) {
    def (fullLine, kind, topic, message) = match
    switch (kind) {
    case "release":
      semver[0] = true
      break
    case "feat":
      semver[1] = true
      break
    case "fix":
      semver[2] = true
      break
    default:
      break
    }
  }

  echo "[After commit analysis] - isMajor:${semver[0]} isMinor:${semver[1]} isPatch:${semver[2]}"
  if (semver.every { it == false }) {
    echo "unable to determine version change with commit analysis"
    // provide support for the Chewy Jenkins supported prefixes
    if (env.CHANGE_BRANCH != null && env.CHANGE_BRANCH.startsWith("release")) {
      semver[0] = true // 'release' branches will always trigger major version bumps
      echo "set major version change"
    } else if (env.CHANGE_BRANCH != null && env.CHANGE_BRANCH.startsWith("feature")) {
      semver[1] = true // 'feature' branches will always trigger minor version bumps
      echo "set major minor change"
    } else if (env.CHANGE_BRANCH != null && (env.CHANGE_BRANCH.startsWith("bugfix") || getBranchName() == "main")) {
      // We should always publish at least a new patch on `main`
      // but we can ignore this on feature branches because
      // the build number is added in the `postfix` step
      semver[2] = true // 'bugfix' branches will always trigger patch version bumps
      echo "set bugfix version change"
    }
  }

  echo "[After branch analysis] - isMajor:${semver[0]} isMinor:${semver[1]} isPatch:${semver[2]}"

  def versionMatches = null
  try {
    versionMatches = parseSemanticVersion(currentVersion)
  } catch (Exception e) {
    echo "falling back to version: ${FALLBACK_VERSION}"
    versionMatches = parseSemanticVersion(FALLBACK_VERSION)
  }
  
  def (currentMajor, currentMinor, currentPatch) = versionMatches
  def (major, minor, patch) = semver
  if (major) {
    echo "determined major version change: ${currentMajor + 1}.0.0${postfix}"
    return "${currentMajor + 1}.0.0${postfix}"
  } else if (minor) {
    echo "determined minor version change: ${currentMajor}.${currentMinor + 1}.0${postfix}"
    return "${currentMajor}.${currentMinor + 1}.0${postfix}"
  } else if (patch) {
    echo "determined patch version change: ${currentMajor}.${currentMinor}.${currentPatch + 1}${postfix}"
    return "${currentMajor}.${currentMinor}.${currentPatch + 1}${postfix}"
  }

  echo "determined no version change: ${currentMajor}.${currentMinor}.${currentPatch}${postfix}"
  return "${currentMajor}.${currentMinor}.${currentPatch}${postfix}"
}

def parseSemanticVersion(String version) {
  def versionPattern = /(\d+)\.(\d+)\.(\d+)(.+)?/
  def versionMatch = version =~ versionPattern
  def versionMatchesAll = versionMatch.findAll()
  def versionMatches = versionMatchesAll[0][1..versionMatchesAll[0].size()-2].collect { Integer.parseInt(it, 10) }
  return versionMatches
}

/**
 * Get the new version we will publish.
 * @return {String}
 */
def getNewVersion() {
  if (env.PUBLISH_VERSION == null) {
    def newVersion = analyzeCommits()
    env.PUBLISH_VERSION = newVersion
  }

  return env.PUBLISH_VERSION
}

/**
 * Publish the new release with the appropriate tag.
 * @return {void}
 */
def publish() {
  def newVersion = getNewVersion()

  withAWS(role:'arn:aws:iam::278833423079:role/CHEWY-cross-jenkins') {
    sh """#!/bin/bash
      ${ecrLogin()}
      docker build -t "\$ECR_REPO:${newVersion}" .
      docker push "\$ECR_REPO:${newVersion}"
    """
  }

  uploadReports()
}

return this
