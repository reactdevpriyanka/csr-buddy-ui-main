describe.skip('< />', () => {
  before(() => {
    cy.login();
    cy.visitActivityFeed();
  });

  describe('validate Alert SnackBar', () => {
    it('should render view alert button title', () => {
      cy.get('button[data-testid="actionButton-warning"]')
        .invoke('text')
        .should('include', 'View Alert');
    });
    it('should render alert title', () => {
      cy.get('[data-testid="snack-card-warning"]')
        .invoke('text')
        .should('include', 'Alert');
    });
    it('should click view alert button', () => {
      cy.get('button[data-testid="actionButton-warning"]').click();
      cy.getByTestId('alert:create agent alert')
      .invoke('text')
      .should('include', 'Create Agent Alert');
    });
  });
});