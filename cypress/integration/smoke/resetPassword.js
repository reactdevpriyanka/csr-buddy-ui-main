import customer from '../../fixtures/customers/customer';
const { email } = customer;

describe('(CSRBT-1270): Reset password feature', () => {
  before(() => {
    cy.login();
    cy.visitActivityFeed2();
  });

  it('should render a reset password link', () => {
    cy.get('[data-testid="reset-password-link"]').should('exist').click();
  });

  it('should display a modal asking for confirmation', () => {
    cy.get('[data-testid="reset-password-modal"]').should('exist').within(() => {
      cy.contains(`A password reset link will be sent to the customer email (${email}). Are you sure you want to send the link?`).should('exist');
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
