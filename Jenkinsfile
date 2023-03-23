#!/bin/env groovy
pipeline {
  agent {
    node {
      label 'amzlnx2'
    }
  }
  options {
    disableConcurrentBuilds()
  }
  tools {
    nodejs 'nodejs-14.15.1'
  }
  environment {
    HUSKY = 0
    CI = 'true'
    ECR_REPO = '278833423079.dkr.ecr.us-east-1.amazonaws.com/csbb/csr-buddy-ui'
    ARTIFACTORY_USER_NAME = credentials('artifactory-username')
    ARTIFACTORY_API_KEY = credentials('artifactory-password')
  }
  stages {
    stage('Initialize Workflow Scripts') {
      options {
        timeout(time: 5, unit: "MINUTES")
      }
      steps {
        script {
          sh(script: 'printenv | sort', label: "Print environment variables")
          deployer = load('deploy.groovy')
          releaser = load('release.groovy')
          releaser.setPackageVersion(releaser.getNewVersion())
          // always publish the version this early to avoid mis-versioning queued builds
          publishVersion = env.PUBLISH_VERSION
          currentBuild.description = publishVersion
          writeFile file: 'version.txt', text: publishVersion
          archiveArtifacts artifacts: 'version.txt'
        }
      }
    }
    stage('Install') {
      options {
        timeout(time: 15, unit: "MINUTES")
      }
      environment {
        CYPRESS_DOWNLOAD_MIRROR = "https://${env.ARTIFACTORY_USER_NAME}:${env.ARTIFACTORY_API_KEY}@chewyinc.jfrog.io/artifactory/cypress-download"
        CYPRESS_CACHE_FOLDER = '/var/lib/jenkins/.cache/Cypress'
      }
      steps {
        configFileProvider([configFile(fileId: 'npmrc-default', targetLocation: './.npmrc')]) {
          withCredentials([usernamePassword(credentialsId: 'jenkins-github-userpass', passwordVariable: 'GRGIT_PASS', usernameVariable: 'GRGIT_USER')]) {
            sh 'yarn install --frozen-lockfile'
          }
        }
      }
    }
    stage('Validate') {
      options {
        timeout(time: 15, unit: "MINUTES")
      }
      parallel {
        stage('Lint') {
          steps {
            sh 'yarn lint'
          }
        }
        // Remove for now to see if it fixes problem with build having to many errors
        // stage('Unit Test') {
        //   steps {
        //     sh 'yarn test:coverage'
        //   }
        // }
        stage('run unit tests and report coverage') {
           steps {
             sh 'yarn jest --coverage'
           }
        }
        stage('Build') {
          steps {
            script {
              sh 'yarn build'
            }
          }
        }
      }
    }

    stage('SonarQube analysis') {
            steps {
                script {
                  scannerHome = tool 'sonar-scanner-4.6.2.2472'
                }
                withSonarQubeEnv('sonarqube-nonprod') {
                  sh """
                     ${scannerHome}/bin/sonar-scanner
                     """
                 }
            }
     }
    stage('Publish') {
      options {
        timeout(time: 15, unit: "MINUTES")
      }
      steps {
        script {
          releaser.publish()
        }
      }
    }
    stage('Deploy') {
      when {
        anyOf { branch 'main' }
      }
      steps {
        script {
          parameters = [
            booleanParam(name: 'AUTO_APPROVE', value: true),
            string(name: 'ALPHA_IMAGE_VERSION', value: env.PUBLISH_VERSION)
          ]
          build(
            job: 'deploy-csrb-stg',
            parameters: parameters,
            propagate: false,
            wait: false
          )
        }
      }
    }
  }
  post {
    always {
      junit 'jest-coverage/*.xml'
    }
    unsuccessful {
      script {
        body = "<${env.BUILD_URL}|${env.JOB_NAME}-${env.BUILD_NUMBER}> was unsuccessful."
        deployer.ping(currentBuild.currentResult, '#csrb-release', body)
      }
    }
  }
}
