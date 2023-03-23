describe.skip('it should click and view event history for an order', () => {
  beforeEach(() => {
  cy.login();
    cy.intercept('GET', '/api/v1/activities/date*', {
      fixture: 'activities/activities+payment-details',
    }).as('activities');
    cy.visitActivityFeed();
    cy.wait('@activities');
  });

  it('should click on an order status click', () => {
    cy.intercept('GET', '/api/v1/event_history*', {
      fixture: 'activities/order-event-history'
    }).as('events');

    cy.getByTestId('badge:1074888242')
      .should('exist')
      .click();

    cy.wait('@events');

    cy.getByTestId('events-history-table')
      .should('exist')
      .and('be.visible');

    cy.getByTestId('order-number')
      .should('exist')
      .and('be.visible')
      .invoke('text')
      .should('equal', 'Order #1074888242')

    cy.getByTestId('event-history-close-button')
      .click();
    
    cy.getByTestId('events-history-table')
      .should('not.exist');

  })
})