describe.skip('(CSRBT-1270): Reset password feature', () => {
  before(() => {
    cy.login();
    cy.visit(`/app/customers/162318096/autoship?agentProfile=DEV - CSRBuddy - Admin`);
    cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
  });

  it('should render a reset password link', () => {
    cy.get('[data-testid="reset-password-link"]').should('exist').click();
  });

  it('should display a modal asking for confirmation', () => {
    cy.get('[data-testid="reset-password-modal"]').should('exist').within(() => {
      cy.contains('Are you sure you want to send the link?').should('exist');
      cy.contains('Ok').should('exist');
      cy.contains('Cancel').should('exist');
    });
  });

  it('should display a success message if email send is successful', () => {
    cy.intercept('POST', '/cs-platform/v1/users/reset', { statusCode: 200 }).as('resetPassword');
    cy.get('[data-testid="reset-password-modal"]').should('exist').within(() => {
      cy.contains('Ok').click({ force: true });
    });
    cy.contains('Reset link has been sent.').should('exist');
  });
});
