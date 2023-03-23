/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect */

import sel from '../../fixtures/workflows/agent-alert';

describe.skip('< />', () => {
  before(() => {
    cy.login();
    cy.intercept('/api/v1/agentNotes*', []).as('agentAlert');
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');

    cy.intercept('GET', `/api/v3/autoship-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders');
    cy.visitActivityFeed();
    cy.wait('@agentAlert');
    cy.contains('Customer Details').should('be.visible');
    cy.wait(2000);
    cy.get('[aria-label="comments"]').should('be.visible');
    cy.get('[aria-label="comments"]').click({ force: true });
  });

  describe('validate No Agent Alert Title', () => {
    it('should render no agent alert title', () => {
      cy.get('[data-testid="alert:no agent alert"]')
        .invoke('text')
        .should('include', sel.noAgentAlertTitle);
    });

    it('should render create agent alert button title', () => {
      cy.get('button[data-testid="alert:create agent alert"]')
        .invoke('text')
        .should('include', sel.createAgentAlertBtnTitle);
    });
  });
});
