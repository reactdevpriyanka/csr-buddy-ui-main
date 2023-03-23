describe.skip('Activity feed', () => {
  const customerId = Cypress.env('TEST_CUSTOMER_ID');

  beforeEach(() => {
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.visitActivityFeed();
    cy.wait('@activities');
  });

  it('should not contain error messages', () => {
    cy.contains('Whoops!').should('not.exist');
    cy.contains('An error has occurred').should('not.exist');
  });
});
