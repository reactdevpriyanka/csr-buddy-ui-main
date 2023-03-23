describe.skip('Pet profile feature toggles', () => {
  describe('add pet', () => {
    it('should hide add pet button when disabled', () => {
      cy.feature('feature.explorer.addPetEnabled', false);
      cy.visitActivityFeed();
      cy.get('[data-testid="add-pet-container"]').should('not.exist');
    });

    it('should show add pet button when enabled', () => {
      cy.feature('feature.explorer.addPetEnabled', true);
      cy.visitActivityFeed();
      cy.get('[data-testid="add-pet-container"]').should('exist');
    });
  });
});
