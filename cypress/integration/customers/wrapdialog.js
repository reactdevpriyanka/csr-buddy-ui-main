/**
 * TODO
 * Figure out why the `/api/v1/subscriptions/:id/orders` route returns "not found"
 * during the Cypress test but works when testing manually
 */
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('call wrap up dialog', () => {
  before(() => {
    cy.login();
    cy.visitActivityFeed();
    cy.get('#__next').should('exist');
  });

  it('should not open the wrap screen by default', () => {
    cy.get('[data-testid="callwrapdialog"]').should('not.exist');
  });

  it('should open the wrap screen when call wrap is called', () => {
    cy.window().then(($win) => {
      $win.dispatchEvent(new CustomEvent('osvc:openmodalwrapscreen', { detail: {} }));
      cy.get('[data-testid="callwrapdialog"]').should('exist').and('be.visible');
    });
  });

  describe('when oracle sends a category label', () => {
    it('should render a read only text field', () => {
      cy.get('[aria-label="close"]').click();
      cy.get('[data-testid="callwrapdialog"]').should('not.be.visible');

      cy.window().then(($win) => {
        $win.dispatchEvent(
          new CustomEvent('osvc:openmodalwrapscreen', {
            detail: {
              category_id: 123,
              category_label: "There's a Honey Badger in my Box",
            },
          }),
        );
      });

      cy.get('[data-testid="wrap-up:read-only-textfield"]').should('exist').and('be.visible');
    });
  });
});
