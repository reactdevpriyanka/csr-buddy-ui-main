describe.skip('Customer information', () => {
  before(() => cy.login());

  it('should hide edit customer button when disabled', () => {
    cy.feature('feature.explorer.editCustomerDetailsEnabled', false);
    cy.visitActivityFeed();
    cy.get('[data-testid="edit-customer-info"]').should('not.exist');
  });

  it('should show edit customer button when enabled', () => {
    cy.feature('feature.explorer.editCustomerDetailsEnabled', true);
    cy.visitActivityFeed();
    cy.get('[data-testid="edit-customer-info"]').should('be.visible');
  });

  it('should hide edit customer tags button when disabled', () => {
    cy.feature('feature.explorer.editCustomerTagsEnabled', false);
    cy.visitActivityFeed();
    cy.get('[data-testid="edit-customer-tags"]').should('not.exist');
  });

  it('should show edit customer tags button when enabled', () => {
    cy.feature('feature.explorer.editCustomerTagsEnabled', true);
    cy.visitActivityFeed();
    cy.get('[data-testid="edit-customer-tags"]').should('be.visible');
  });
});
