import upcomingFulfillment from '../../fixtures/activities/autoship+upcoming_fulfillment';

describe.skip('Editing a pet profile', () => {
  before(() => {
    cy.login();
    cy.intercept('GET', '/api/v1/customer/*', { fixture: 'customers/customer+petProfiles' }).as('customer');
    cy.intercept('/api/v3/activities/*', upcomingFulfillment).as('activities');

    cy.intercept('/api/v3/order-activities/*', []);
    cy.intercept('GET', `/api/v3/autoship-activities/**`, {
      fixture: `/activities/order`,
    }).as('autoships');
    cy.visitActivityFeed();
    cy.wait('@activities');
    cy.wait('@autoships');
    cy.wait('@customer');
  });

  it('should load the pet profile content', () => {
    cy.get('[data-testid="pet-profile"]').should('exist');
  });

  it('should open edit profile panel when edit button is clicked', () => {
    cy.intercept('GET', '/api/v1/customer/*', { fixture: 'customers/customer+petProfiles' }).as('customer');
    cy.get('[data-testid="pet-profile:edit"]').should('exist').click({ force: true });
    cy.contains('Select a pet to edit').should('exist').and('be.visible');
  });

  it('should show all pets available in pet selection dropdown', () => {
    cy.get('[data-testid="select-pet-profile"]').children('div').first().click({ force: false });
    cy.contains('Jimmy').should('be.visible');
    cy.get('tbody>tr').eq(0)
    cy.get('button').contains('Next').should('be.visible');
  });

  // TO-DO this needs refactor to open the dropdown and find the pet ID
  it('should display pet information fields when pet is selected', () => {
    cy.get('[data-testid="select-pet-profile"]').first().click({ force: true });
    cy.get('[data-testid="add-pet-profile"]').should('exist');
  });

  it('should set value to currently selected pet', () => {
    cy.get('[data-testid="add-pet-gender"]').find('input').invoke('val').should('eq', 'MALE');
    cy.get('[data-testid="add-pet-breed"]').find('input').invoke('val').should('eq', 'Guppy');
    cy.get('[data-testid="add-pet-weight"]').find('input').invoke('val').should('eq', '2');
    cy.get('[data-testid="birth-date"]').find('input').invoke('val').should('eq', '2022-03-15');
    cy.contains('Cefa-Drops').should('exist');
    cy.contains('Cephalexin').should('exist');
    cy.contains('Clindamycin').should('exist');
    cy.contains('Beta Blockers').should('exist');
    cy.contains('Bladder/Kidney Stones').should('exist');
    cy.contains('Hypothyroid').should('exist');
  });
});
