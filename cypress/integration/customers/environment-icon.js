describe.skip('environment icon', () => {
  before(() => cy.login());

  it('should not render when no text is defined', () => {
    cy.feature('lang.environment', '');
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.get('[data-testid="env-icon"]').should('not.exist');
  });

  it('should render when text is defined', () => {
    cy.feature('lang.environment', 'You are using CSR Buddy Alpha');
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.contains('You are using CSR Buddy Alpha').should('exist');
  });
});
