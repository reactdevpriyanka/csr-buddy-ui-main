describe.skip('<ReactivatePet />', () => {
  before(() => {
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/order-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders');
    cy.intercept('GET', '/api/v1/customer/*', { fixture: 'customers/customer+petProfiles' }).as(
      'customer',
    );
    cy.visitActivityFeed();
  });

  describe('validate reactivate pet profile', () => {
    it('should create a new pet profile', () => {
      cy.wait(500);
      cy.getByTestId('pet-profile:name').click({ force: true });
      cy.getByTestId('pet-profile:name').click();
      cy.getByTestId('pet-profile:name').click();
      cy.wait(500);
      cy.contains('Edit Pet').should('be.visible');
      cy.contains('Edit Pet').click({ force: true });
      cy.get('[data-testid="reactivate-pet"]').scrollIntoView().click({ force: true });
    });

    describe('when canceling edit pet', () => {
      // TODO this is copy pasta'd from the above :|
      before(() => {
        cy.login();
        cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
          fixture: `/activities/activities+delivered`,
        }).as('activities');
        cy.intercept('GET', `/api/v3/order-activities/**`, {
          fixture: `/activities/order`,
        }).as('orders');
        cy.intercept('GET', '/api/v1/customer/*', { fixture: 'customers/customer+petProfiles' }).as(
          'customer',
        );
        cy.visitActivityFeed();
      });

      it('should return to activity feed', () => {
        cy.wait(500);
        cy.contains('Jimmy').click({ force: true });
        cy.contains('Jimmy').click();
        cy.getByTestId('pet-profile:name').click();
        cy.wait(500);
        cy.contains('Edit Pet').click({ force: true });
        cy.get('[data-testid="add-new-pet-cancel"]').scrollIntoView().click();
        cy.location('pathname').should(
          'eq',
          `/app/customers/${Cypress.env('TEST_CUSTOMER_ID')}/activity`,
        );
      });
    });
  });
});
