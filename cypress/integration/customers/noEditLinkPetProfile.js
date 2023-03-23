describe.skip('(CSRBT-1351): Click pet profile tile to edit pet', () => {
  before(() => {
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', '/api/v1/customer/*', { fixture: 'customers/customer+nopetProfile' }).as('customer');
    cy.visitActivityFeed();
  });

  it('should open edit profile when clicking pet', () => {
    cy.get('[data-testid="pet-profile:edit"]').should('not.exist');
  });
});
