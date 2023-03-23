describe.skip('Customer services', () => {
  before(() => cy.login());

  it('should hide customer service when disabled', () => {
    cy.feature('feature.explorer.vetDietEnabled', false);
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.get('[data-testid="disabledIcon"]').should('not.exist');
  });

  it('should show edit customer button when enabled', () => {
    cy.feature('feature.explorer.vetDietEnabled', true);
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.get('[data-testid="disabledIcon"]').should('exist');
  });
});
