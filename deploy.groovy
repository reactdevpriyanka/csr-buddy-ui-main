import net.sf.json.JSONArray
import net.sf.json.JSONObject

// get the DD secret
def getPlaintextSecret(secretName) {
  image = "278833423079.dkr.ecr.us-east-1.amazonaws.com/plat/chewy-terraform:0.13.7-9f9f519"
  region = "us-east-1"

  docker.image(image).inside("-e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=${region} --entrypoint=''") {
    return sh(script: "aws secretsmanager get-secret-value --secret-id ${secretName} | jq -r .SecretString", returnStdout: true).trim()
  }
}

// ping a Slack channel
def ping(status, channel, body) {
  def color = (status == 'SUCCESS') ? '#5cb58a' : '#9e1c33'
  JSONObject attachment = new JSONObject();
  attachment.put('author', 'Jenkins');
  attachment.put('author_link', env.JENKINS_URL);
  attachment.put('title', env.JOB_NAME + '-' + env.BUILD_NUMBER);
  attachment.put('title_link', env.BUILD_URL);
  attachment.put('text', body.toString());
  attachment.put('color', color);
  attachment.put('footer', 'Jenkins');
  JSONArray attachments = new JSONArray();
  attachments.add(attachment);
  slackSend channel: channel, attachments: attachments.toString()
}

// assume we want to ping `#csrb-release` if no channel provided
def ping(status, body) { ping(status, 'csrb-release', body) }

def pingDeploying(environment) {
  ping('SUCCESS', "Deploying ${getPublishVersion()} to ${environment}")
}

def pingDeploySuccess(environment) {
  ping('SUCCESS', "Deploy to ${environment} has completed successfully")
}

def pingDeployFailed(environment) {
  ping('FAILURE', "Deploy to ${environment} failed")
}

def deployApp(String environment) {
  build(
    job: "deploy-csrb-${environment}",
    parameters: getDeploymentParameters(),
    propagate: true
  )
}

def getDeploymentParameters() {
  def branchName = env.CHANGE_BRANCH != null
      ? env.CHANGE_BRANCH
      : env.BRANCH_NAME
  def parameters = [booleanParam(name: 'AUTO_APPROVE', value: true)]
  if (branchName.startsWith('hotfix/alpha')) {
    parameters.push(string(name: 'ALPHA_IMAGE_VERSION', value: env.PUBLISH_VERSION))
  } else if (branchName.startsWith('hotfix/beta')) {
    parameters.push(string(name: 'BETA_IMAGE_VERSION', value: env.PUBLISH_VERSION))
  } else if (branchName.startsWith('hotfix/stable')) {
    parameters.push(string(name: 'FRONTEND_IMAGE_VERSION', value: env.PUBLISH_VERSION))
  } else {
    parameters.push(string(name: 'ALPHA_IMAGE_VERSION', value: env.PUBLISH_VERSION))
  }
  return parameters
}

return this
