const { wait } = require("@testing-library/dom");

describe.skip('Activity payment details', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '/api/v1/activities/date*', {
      fixture: 'activities/activities+payment-details',
    }).as('activities');
    cy.visitActivityFeed();
    cy.wait(10000);
  });

  it('should display credit card details', () => {
    cy.get('[data-testid="payment-details-1070058330"]')
      .should('exist')
      .and('be.visible')
      .within(() => {
        cy.getByTestId('payment-method:label')
          .should('exist')
          .and('be.visible')
          .invoke('text')
          .should('equal', 'AMEX ending in 1347');

        cy.getByTestId('amex-icon').should('exist').and('be.visible');
      });
  });
});
