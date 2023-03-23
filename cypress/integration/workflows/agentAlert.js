/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect, jest/no-disabled-tests */

const selectors = '@selectors';

/**
 * TODO
 * This test is flaky. I don't currently know why. I think it can be fixed
 * but I can't really figure out how to get elements to scroll into view.
 * Iframes.
 */
describe.skip('/customers/:customerId/activity', () => {
  before(() => {
    cy.viewport(1536, 960);
    cy.visit(`https://chewy--tst3.custhelp.com/AgentWeb/`);
    // TODO: get this into a secret
    cy.loginOracle('pragya_tst3_automated_test', 'AutomatedP@s5w0rd', '#loginbutton');
    cy.loginBackofficeIFrameInOracle(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'));
    cy.loginCSRB2InOracle(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'));
  });

  describe('validate no agent alert', () => {
    it('should render no agent alert', () => {
      cy.get("iframe[name*='CSR Buddy']").then(($firstIframe) => {
        cy.wrap($firstIframe).as('firstIframeReference');
        const $secondIframeReference = $firstIframe.contents().find("iframe[name*='csr-buddy']");
        cy.wrap($secondIframeReference).as('secondIframeReference');
        cy.get('@secondIframeReference').then(($secondIframe) => {
          const $body = $secondIframe.contents().find('body');
          cy.get(selectors).then((sel) => {
            cy.wrap($body)
              .find(`[aria-label='comments']`).click({ force: true });
            cy.wrap($body)
              .find("section[data-testid=alert:no agent alert]").contains("No Agent Alerts");
            cy.wrap($body)
              .find("section[data-testid=alert:create agent alert]").click();    
          });
        });
      });
    });
  });
});
