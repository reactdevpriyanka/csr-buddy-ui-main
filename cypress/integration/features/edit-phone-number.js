describe.skip('Edit phone number field', () => {
  beforeEach(() => cy.login());

  it('should hide edit phonenumber field when disabled', () => {
    cy.feature('feature.explorer.phoneNumberEditEnabled', false);
    cy.visitActivityFeed();
    cy.get('[data-testid="edit-phone"]').should('not.exist');
  });
  it('should hide nonedit phonenumber field when disabled', () => {
    cy.feature('feature.explorer.phoneNumberNonEditEnabled', false);
    cy.visitActivityFeed();
    cy.get('[data-testid="noneditable-phone"]').should('not.exist');
  });
});
