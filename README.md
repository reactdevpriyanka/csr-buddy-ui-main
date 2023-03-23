# CSR Buddy UI

Version 5.x.x

## Links

- [Confluence](https://chewyinc.atlassian.net/wiki/spaces/CUST/pages/269682686/CSR%2BBuddy)
- [JIRA Project](https://chewyinc.atlassian.net/browse/CSRB)
- [JIRA Board](https://chewyinc.atlassian.net/secure/RapidBoard.jspa?rapidView=955)

## Getting Started

This guide assumes that you're on a Mac and have the following installed on your system:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Homebrew](https://brew.sh)

There is a companion [Confluence page](https://chewyinc.atlassian.net/wiki/spaces/CUST/pages/1420821153/How+to+run+csr-buddy-ui+locally) for easy reference, but this README should be considered the source of truth. 

### Installing dependencies

First, install Node.js and Yarn if you haven’t already:

```sh
brew install node yarn
```

Our private NPM registry is hosted on Artifactory. To authenticate Yarn with Artifactory, follow these steps:

1. Using Okta, navigate to JFrog Artifactory
1. Visit your profile/account settings page
1. Add an API key
1. Copy that API key
1. Edit your shell profile (`.bash_profile` if using bash, `.zprofile` if using zsh) to export the following:

```sh
export ARTIFACTORY_USERNAME=<your Chewy email>
export ARTIFACTORY_PASSWORD=<your API key>
```

Then run this command:

```sh
curl -u "$ARTIFACTORY_USERNAME:$ARTIFACTORY_PASSWORD" https://chewyinc.jfrog.io/chewyinc/api/npm/auth > ~/.npmrc
```

Now your `~/.npmrc` should look like this:

``` sh
_auth = <your JFrog auth token>
always-auth = true
email = <your Chewy email>
registry = https://chewyinc.jfrog.io/chewyinc/api/npm/npm
```

If you’re missing that fourth line specifying the registry, it’s ok to add it manually.

At this point, you should be able to pull down dependencies from Artifactory by running this command in the project root directory:

```sh
yarn install
```

### Running on localhost

When running the UI locally, we typically also run a gateway proxy server that routes all requests from the frontend to backend services running in `$ENVIRONMENT`. For that, we mostly use stg and qat during local development.

> **NOTE:** If you need to work without the gateway present, you can use yarn dev:std to run only the standalone application. In that case, you can skip the rest of this section.

To start, copy this config into a file in the project root directory called `.env.local`:

```properties
# Uncomment to use local services
#CSRB_API_BASE_URL=http://csrb-app-service:8080

NODE_ENV=development
ENVIRONMENT=qat
SPRING_PROFILES_ACTIVE=$ENVIRONMENT
CHEWY_ENV=$ENVIRONMENT
NEXT_PUBLIC_NODE_ENV=$NODE_ENV
APP_VERSION=local
SFW_URL=http://localhost:8080
NEXT_PUBLIC_MOCK_ORACLE=true
NEXT_PUBLIC_ORACLE_USERNAME=admin
NEXT_PUBLIC_ORACLE_PASSWORD=new123pass
ORACLEREST_BASEURL=https://chewy--tst3.custhelp.com/
ORACLEREST_ICR_ID=108613
ICR_TTL=3600
AWS_PROFILE=qat-nebula
AWS_REGION=us-east-1
```

#### Running `csrb-tierb-api` locally
Add the following to `.env.local`:

If `csrb-tierb-api` is running on its default port of `8080` assign another port to the `csrb-gateway`:

```properties
CSRB_GATEWAY_PORT=9090
```

Running `csrb-tierb-api` in docker:

```properties
TIERB_BASE_URL_STG=http://host.docker.internal:8080
```

Running `csrb-tierb-api` standalone

```properties
TIERB_BASE_URL_STG=http://localhost:8080
```

### Mocking Oracle

The NextJS app will inject a fake version of the Oracle communicator class into the application and will receive events that are `emit`ed to the parent frame and ensure communcation with cs-platform is functionaling properly.

Copy these settings into your `.env.local` file:

```sh
NEXT_PUBLIC_MOCK_ORACLE=true
NEXT_PUBLIC_ORACLE_USERNAME=admin
NEXT_PUBLIC_ORACLE_PASSWORD=new123pass
```

This can also help to ensure that manual test cases pass for certain scenarios:

- Guided workflow submission
- Back office auth
- Incident start data
- Wrap screen functionality

You will find `console` logs in the browser environment that will display the event and data sent to Oracle when a method is called.

If you need to test the wrap screen run: `window.__ORACLE__.wrap({ /* data for the wrap screen */ })` to open the wrap screen with the data you wish to pass.

### Debugging UI responsiveness

We have a responsive debugger component that displays the current screen breakpoint and viewport width. It can be enabled locally by adding the following to `.env.local`:

``` sh
RESPONSIVE_DEBUG=true
```

### Local `csrb-gateway` setup

We run the gateway locally in a Docker container. The `csrb-gateway` image is hosted with ECR on Nebula 2, Chewy's cloud platform (see the [Nebula 2 User Guide](https://chewyinc.atlassian.net/wiki/spaces/CE/pages/5639313) to learn more). To access that registry, we must install [nebula-utils](https://github.com/Chewy-Inc/nebula-utils).

First, install the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html):

``` sh
brew install awscli
```

Now configure your AWS region:

```sh
aws configure
```

As a result, your ~/.aws/config should include this:

``` sh
[default]
region = us-east-1
```

Next, install nebula-utils from GitHub as a Python 3 package:

```sh
pip3 install -U git+ssh://git@github.com/Chewy-Inc/nebula-utils.git#egg=nebula-utils
```

If you see an error like the following, it means that you have a bad version of pip3 and it failed to install nebula-utils:

``` sh
ImportError: cannot import name 'PackageFinder' from 'pip._internal.index' (/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.8/lib/python3.8/site-packages/pip/_internal/index/__init__.py)
```

You can fix this by reinstalling pip3:

```sh
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python3 get-pip.py
```

Now set your AWS credentials via Okta SSO with aws-sso-util:

```sh
aws-sso-util config generate
```

You will be prompted for the SSO Start URL. Enter the chewy-okta start url: https://chewy-okta.awsapps.com/start

Select us-east-1 as the default region.

Now run the login command with the persist flag for short term credentials for the QAT env:

```sh
aws-sso-util login -p qat-nebula --persist
````

Once aws-sso-utils has successfully authenticated with AWS, you are ready to login to ECR:

``` sh
echo $(aws ecr get-login-password) | docker login --username AWS --password-stdin 278833423079.dkr.ecr.us-east-1.amazonaws.com
```

if the above command says you don't have access then we need to get shared-services (ECR) credentials on our command line
```sh
aws-sso-util login --persist
```

Select shared-services and try the above aws ecr command

Install jq if its not already present

``` sh
brew install jq
```

Now start the application with this command:

```sh
yarn dev
```

This command will download and run the gateway in the background with its output squelched, via `docker-compose`. The configuration in your `.env.local` will determine which environment you are working in.

If you need to see the container logs, run this command in a separate terminal:

```sh
yarn docker:logs
```

The app’s main entry point is the activity feed page, which is located at `http://localhost:8080/app/customers/{customerId}/activity`. You will need to pass the `DEV - CSRBuddy - Admin` agent profile as a query param to enable all features for local development:

`http://localhost:8080/app/customers/{customerId}/activity?agentProfile=DEV%20-%20CSRBuddy%20-%20Admin`

When you first visit this page, you will be greeted with a login screen. Use the default Backoffice username and password to begin working. (If you need to know what those are please ping `@csrbdevs` on Slack.)

If you encounter following error: ERROR: The image for the service you're trying to recreate has been removed. If you continue, volume data could be lost. Consider backing up your data before continuing. Then follow below steps to download project image again:

```sh
nebula-utils print-creds -p shared-services (copy the output, paste and hit enter)
```

```sh
echo $(aws ecr get-login-password) | docker login --username AWS --password-stdin 278833423079.dkr.ecr.us-east-1.amazonaws.com/csbb/csrb-gateway
```

```sh
yarn dev
```

Here are some test customers you can access locally, depending on which environment you’re working in:
- qat: http://localhost:8080/app/customers/148790734/activity?agentProfile=DEV%20-%20CSRBuddy%20-%20Admin
- stg: http://localhost:8080/app/customers/152454973/activity?agentProfile=DEV%20-%20CSRBuddy%20-%20Admin

### Running dockerized regression tests

If you havn't authenticated with nebula-utils and logged into the Docker registry run these commands

1. Run ‘nebula-utils’ and log into your account
2. Use a profile for the shared account ‘export AWS_PROFILE=shared-services’
3. Once authenticated and you have exported the profile, execute 
```sh
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 278833423079.dkr.ecr.us-east-1.amazonaws.com
```
 (this fetches temporary credentials from AWS ECR and pipes them to the docker daemon so that it can use those tokens to pull from the private ECR registry where the docker container lives.

cd into the /cypress directory and run the command ./regression-test.sh

From there, the regression-docker-compose.yml file should be invoked to pull images for the gateway and csrb-ui and spin up cypress in a 3rd container.

Remember, the env variables inside .env.local will determine what environment the dockerized regression suite uses.

If you want the regression suite to use localhost if you're running TierB locally add:

```
CSRB_API_BASE_URL=http://csrb-app-service:8080
```

into the .env.local file

## CI/CD Pipeline

Chewy utilizes [Jenkins](https://www.jenkins.io) to build and deploy code to the various environments.

### Jenkins Generated Build Tag

To have Jenkins generate a build tag, the squashed commit needs to be in the format of
- Type of Change (feat, fix, chore)
- Short description in parenthesis
- Colon
- Merge commit message

Example:
`fix(gwf): Fix breadcrumbs not displaying when expected`

### Automated Deploys

For more information, please see this [Confluence page](https://chewyinc.atlassian.net/wiki/spaces/~972153912/pages/1328580175/CSR+Buddy+Automated+Continuous+Delivery).

We follow a Continuous Delivery paradigm by allowing Git merges to control releases:

- A merge to `alpha` will release the code to the `alpha` service for developers to validate their changes
- A merge to the `beta` branch from `alpha` will release the code to the `beta` service for the Innovation Team to provide feedback on features
- A merge to the `main` branch from `beta` will release the code to the `stable` service for use by the entire call center

## Testing

Unit tests and integration tests are required for code to be promoted to production as documented in the [contributing guidelines](.github/CONTRIBUTING.md).

To run the tests once run these commands:

```sh
yarn test                # unit tests (will remain in watch mode and run for changed files)
yarn cy:e2e              # integration tests
```

To have the runners continuously run the tests while you write code, run these commands:

```sh
yarn cy:watch        # runs all selected suites when a file is changed
yarn test --watchAll # runs all unit tests when a file is changed
```

### Unit Testing

Unit tests leverage Testing Library by Facebook (`@testing-library/react`) and utilize Jest as the test runner.

While developing a component it is recommended to follow a TDD style approach where the test case is written before the code for a component.

As an example, we would begin by writing the spec for `Component` like so:

```js
// Component.spec.js
import { renderWrap } from '@/utils';
import Component from './Component';

// This test is written before the code for the component.
// Continue coding to resolve errors in the test runner
// until the test suite passes:
describe('<Component />', () => {
  const render = renderWrap(Component);

  test('it should render hello world', () => {
    const { getByText } = render();
    expect(getByText('Hello World')).toBeTruthy();
  });
});
```

We should see an error indicating that no 'Component' file exists. We remedy this by creating the file:

```js
// Component.js
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const Component = () => {};

Component.propTypes = {};

export default Component;
```

We should see the test fail for a different reason. Finally, finish coding to this spec by completing `Component.js`:

```js
// ...
const Component = () => {
  return (
    <p>{'Hello World'}</p>
  );
};
// ...
```

#### `renderWrap`

You probably noticed we're pulling in a function called `renderWrap` from `@/utils`.

This function wraps the component in a `ThemeProvider` so that you can use `makeStyles` from the Material UI library and test various aspects of the component.

It returns the render result of the `@testing-library/react` `render` function so that you can use an query you want, but if you provide a `data-testid` attribute on your component you can use a special helper like so:

```js
describe('<Component />', () => {
  const render = renderWrap(Component, { testId: 'component' });

  test('it should render', () => {
    const element = render.andGetByTestId();
    // ...assertions...
  });
});
```

This allows you to get the component by its test ID in any test while also making use of the fantastic testing library queries.

### Integration Testing

[Cypress](https://cypress.io) (`cypress`) is an integration testing framework for JavaScript applications.

You'll need to set environment variables before running the tests (these are only examples):

```sh
export ADMIN_USERNAME="some_admin_user"
export ADMIN_PASSWORD="whatIsMyPassword"
export TEST_CUSTOMER_ID="123456789"
export AGENT_PROFILE="DEV - CSRBuddy - Admin"
```

Run this command to develop against your local environment:

```sh
yarn cy
```

**NOTE:**: These variables will vary depending on the environment. Documentation for this configuration scheme will be coming soon.

Chewy as an organization has a commitment to delivering accessible code to its users. While this is an internal application we as developers believe it is our duty to make this application accessible to anyone who needs to use it to comply with being able to offer reasonable accommodations for any Chewy employee.

We use `cypress-axe` to test for accessibility and when building a new screen of the application, please make this your first test-case:

```js
// cypress/integration/new_page_spec.js
describe('new page', () => {
  it('should be accessible', () => {
    cy.visit('/newpage');
    cy.injectAxe();
    cy.checkAccessibility();
  });
});
```

Prefer using our `cy.checkAccessibility()` helper over Cypress's `cy.checkA11y()`. The former wraps the latter and also prints accessibility violations to the console to aid with debugging.

If you need to test a page's accessibility once it's in a certain state (e.g. an input field is focused, a modal is open, etc.), this helper can also be called after the automated test has interacted with the page. (See `cypress-axe` [documentation](https://www.npmjs.com/package/cypress-axe#user-content-cychecka11y).)

For CSRB we have the engineer write the integration tests for their feature. Code owners and team members should review the integration tests as if they were the target audience of the feature to ensure that integration tests meet the acceptance criteria and to catch edge cases.

Finally, a QA analyst will check the feature as it is deployed to QAT for final review.

We use a `globals` fixture for DOM selectors so that tests are more readable and so that selectors can be treated as 'constants.'

Here's an example of how to load them in your integration tests:

```js
describe('your testing suite name', () => {
  let selectors = null;

  beforeEach(() => {
    cy.fixture('globals').then(({ segment }) => {
      selectors = segment;
    });
  });

  // ...
});
```

In `globals.json`:

```js
{
  // ...
  "segment": {
    "container": "[data-testid='container']"
  },
  // ...
}
```

In your test you can then utilize the selector like so:

```js
  // ...

  it('should render a container', () => {
    cy.visit('/your-page').get(selectors.container).contains('Some text');
  });

  // ...
```

## Issues

Please connect with us on Slack: [#csr-buddy-public](https://chewy.slack.com/archives/C01LS99PMQC)
