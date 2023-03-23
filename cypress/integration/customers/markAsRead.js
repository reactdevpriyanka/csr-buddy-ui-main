describe.skip('<MarkAsRead />', () => {
  before(() => {
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/autoship-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders')
    cy.visitActivityFeed();
    cy.get('[aria-label="comments"]').should('be.visible');
    cy.wait(500);
    cy.get(`button[aria-label='comments']`,{ timeout: 6000 }).click({ force: false });
    cy.get(`[aria-label='create agent alert']`).click({ force: true });
  });

  describe('validate agent alert', () => {

    it('when clicking mark as read', () => {
      cy.get('[data-testid="add-alert-type"]').find('[role="button"]').click({ force: true });
      cy.get('[data-testid="alert:type-Customer Attitude & Sentiments"]').click();
      cy.get('[data-testid="add-alert-note"]').type('This is agent alert');
      cy.get('[data-testid="save-agent-alert"]').click();
      cy.get(`[data-testid*='mark-as-read-']:first`).scrollIntoView().click();
      cy.get('[data-testid*="read-"]:first')
        .invoke('text')
        .should('include', 'Read');
    });

  });
});
