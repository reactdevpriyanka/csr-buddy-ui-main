describe.skip('Create Agent Alert Btn', () => {
  before(() => cy.login());

  it('should hide create agent alert when disabled', () => {
    cy.feature('feature.explorer.createAgentAlertBtnEnabled', false);
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.get('[data-testid="alert:create agent alert"]').should('not.exist');
  });
});
