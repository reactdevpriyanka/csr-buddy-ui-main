import customer from '../../fixtures/customers/customer+petProfiles';
import petProfile from '../../fixtures/customers/petProfile';

describe.skip('Click pet profile tile to view pet', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/order-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders');
    cy.intercept('GET', '/api/v1/customer/*', customer).as('customer');
    cy.intercept('GET', '/api/v1/pets/*', petProfile).as('pet');
    cy.visitActivityFeed();
    cy.wait('@activities');
    cy.wait('@orders');
    cy.wait('@customer');
  });

  it.only('should copy pet name when double clicking pet', () => {
    cy.intercept('GET', '/api/v1/pets/*', petProfile).as('pet');
    cy.contains(petProfile.name).dblclick({ force: true });
    cy.contains('Pet Profiles').should('exist');
    cy.contains('Copied').should('exist');
  });

  it.only('should open view pet profile when clicking pet', () => {
    cy.intercept('GET', '/api/v1/pets/*', petProfile).as('pet');
    cy.contains(petProfile.name).click({ force: true });
    cy.contains('Pet Details').should('exist');
    cy.getByTestId('viewPet:name-value').contains(petProfile.name);
    cy.getByTestId('viewPet:type-value').contains(petProfile.type.name);
    cy.getByTestId('viewPet:sex-value').contains('Female');
    cy.getByTestId('viewPet:weightclass-value').contains('Underweight');
    cy.getByTestId('viewPet:birthday-value').contains('2022-02-01');
    cy.getByTestId('viewPet:adoptionday-value').contains('N/A');
    cy.contains('Corn').should('exist');
    cy.contains('Beef').should('exist');
    cy.contains('Egg').should('exist');
    cy.contains('ACE Inhibitors').should('exist');
    cy.contains('Clavulanic Acid').should('exist');
    cy.contains('Cephalosporins').should('exist');
  });

  it('should go back to Customer details', () => {
    cy.intercept('GET', '/api/v1/pets/*', petProfile).as('pet');
    cy.contains('Jimmy').click({ force: true });
    cy.contains('Back').click({ force: true });
    cy.contains('Customer Details').should('exist');
  });

  it('should open edit pet profile when clicking edit', () => {
    cy.intercept('GET', '/api/v1/pets/*', petProfile).as('pet');
    cy.contains('Jimmy').click({ force: true });
    cy.contains('Edit Pet').click({ force: true });
    cy.contains('Select a pet to edit').should('exist');
  });
});
