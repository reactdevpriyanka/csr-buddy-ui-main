// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/cypress/add-commands';
import './featureFlags';

// Print cypress-axe violations to the terminal
// https://blog.sapegin.me/til/testing/detecting-accessibility-issues-on-ci-with-cypress-axe/
function printAccessibilityViolations(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
      violations.length === 1 ? 'was' : 'were'
    } detected`,
  );

  cy.task(
    'table',
    violations.map(({ id, impact, description, nodes }) => ({
      impact,
      description: `${description} (${id})`,
      nodes: nodes.length,
    })),
  );
}

Cypress.Commands.add(
  'checkAccessibility',
  {
    prevSubject: 'optional',
  },
  (subject, { skipFailures = false } = {}) => {
    cy.checkA11y(subject, null, printAccessibilityViolations, skipFailures);
  },
);

Cypress.Commands.add('loginOracle', (username, password, loginBtn) => {
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get(loginBtn).click();
});

Cypress.Commands.add('loginBackofficeIFrameInOracle', (username, password) => {
  cy.get("iframe.modalWindow[id*='ExtensibilityModalWindow']", { timeout: 90000 }).should(
    'be.visible',
  );
  getBOIframeBody().within((body) => {
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#submitSignIn').should('be.visible').click();
  });

  cy.get("button[aria-label='Settings and Actions']", { timeout: 90000 }).should('be.visible');
  cy.findByTitle('Create a new Incident').click();
  cy.get('[automationid=Email]', { timeout: 90000 }).should('be.visible');
  cy.get('[automationid=Email]', { timeout: 90000 })
    .type('cypress_automation@chewy.com')
    .type('{enter}');
  cy.wait(20000); // eslint-disable-line cypress/no-unnecessary-waiting
  cy.get("button[data-commandtype='upsertContactAddToIncident']")
    .first()
    .should('be.visible')
    .click();
  cy.wait(10000); // eslint-disable-line cypress/no-unnecessary-waiting
});

const getBOIframeBody = () => {
  return cy
    .get("iframe.modalWindow[id*='ExtensibilityModalWindow']", { timeout: 45000 })
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
};

Cypress.Commands.add('loginCSRB2InOracle', (username, password) => {
  cy.get("iframe[name*='CSR Buddy']").then(($firstIframe) => {
    cy.wrap($firstIframe).as('firstIframeReference');
    const $secondIframeReference = $firstIframe.contents().find("iframe[name*='csr-buddy']");
    cy.wrap($secondIframeReference).as('secondIframeReference');
    cy.get('@secondIframeReference').then(($secondIframe) => {
      const $body = $secondIframe.contents().find('body');
      cy.wrap($body);
      cy.wait(15000); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get($body).then(($body) => {
        if ($body.find('#username').length > 0) {
          //evaluates as true
          cy.wrap($body).find('#username').type(username);
          cy.wrap($body).find('#password').type(password);
          cy.wrap($body).find(`[type='submit']`).click();
          cy.wait(15000); // eslint-disable-line cypress/no-unnecessary-waiting
        }
      });
    });
  });
});

Cypress.Commands.add('login', {}, (body = {}) => {
  cy.clearCookie('SESSION');
  cy.request({
    url: '/login',
    failOnStatusCode: false,
    method: 'POST',
    form: true,
    body: {
      username: Cypress.env('ADMIN_USERNAME'),
      password: Cypress.env('ADMIN_PASSWORD'),
      ...body,
    },
  })
  .then(({ allRequestResponses }) => {
    const [response] = allRequestResponses;
    const [rawCsrbCookie] = response['Response Headers']['set-cookie'][0].split('; ');
    const [__key__, value] = rawCsrbCookie.split('='); // eslint-disable-line no-unused-vars
    cy.setCookie('SESSION', value);
  });
});

Cypress.Commands.add('getByTestId', {}, (testId) => cy.get(`[data-testid="${testId}"]`).eq(0));

Cypress.Commands.add('interceptWith', {}, (route, body) => cy.intercept(route, { body }));


