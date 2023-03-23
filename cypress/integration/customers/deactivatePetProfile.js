import customer from '../../fixtures/customers/customer';

const [petProfile] = customer.pets;
const interactionPanel = 'editPetProfile';

describe.skip('deactivate pet profile', () => {
  before(() => cy.login());

  beforeEach(() => {
    cy.intercept('GET', `/api/v1/customer/*`, customer).as('customer');
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/autoship-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders')
    cy.withPanel({
      customerId: customer.id,
      interactionPanel,
    });

    cy.wait('@customer');

    // select first option
    cy.getByTestId('select-pet-profile')
      .find('input')
      .click()
      .type('{downArrow}{enter}');

    cy.intercept('GET', `/api/v1/pets/*`, petProfile).as('petProfile');

    cy.contains('button', 'Next')
      .should('not.be.disabled')
      .click();

    cy.wait('@petProfile');

    cy.getByTestId('edit-pet-profile').within(() => {
      cy.root()
        .invoke('text')
        .should('include', 'Select a pet to edit');

      cy.getByTestId('add-pet-name')
        .should('exist')
        .and('be.visible')
        .find('input')
        .invoke('val')
        .should('eq', petProfile.name);
    });
  });

  it('should deactivate a pet profile', () => {
    cy.contains('button', 'Deactivate Pet')
      .scrollIntoView()
      .should('exist')
      .and('be.visible')
      .click();

    cy.getByTestId('add-pet-retirement-reason')
      .find('div[role="button"]')
      .click();

    cy.contains('Other').click();
    cy.contains('button', 'Save Changes').click();

    cy.intercept('GET', `/api/v1/customer/*`, {
      ...customer,
      pets: [{...petProfile, status: 'INACTIVE'}].concat(customer.pets.slice(1))
    }).as('updatedCustomer');

    // confirm deactivation
    cy.getByTestId('deactivate-pet-dialog')
      .should('exist')
      .and('be.visible')
      .within(() => {
        cy.contains('Deactivate Pet?').should('exist').and('be.visible');
        cy.intercept('PUT', '/api/v1/pets/*', { statusCode: 200 }).as('submit');
        cy.contains('button', 'Deactivate Pet').click();
      });

    cy.wait('@submit');

    cy.location('search')
      .should('not.include', `interactionPanel=${interactionPanel}`)
      .should('not.include', `petId=${petProfile.id}`);

    cy.wait('@updatedCustomer');

    // verify that the above change is reflected in the customer sidebar
    cy.contains('[data-testid="pet-profile:name"]', petProfile.name)
      .closest('[data-testid="pet-profile:card"]')
      .should('have.class', 'inactive');
  });

  it('should cancel pet profile deactivation', () => {
    cy.contains('button', 'Deactivate Pet')
      .scrollIntoView()
      .should('exist')
      .and('be.visible')
      .click();

    cy.getByTestId('deactivate-pet-profile-title')
      .invoke('text')
      .should('include', 'Select a pet to edit');

    cy.contains('button', 'Cancel')
      .click();

    // verify that the pet profile editor is closed
    cy.location('search')
      .should('not.include', `interactionPanel=${interactionPanel}`)
      .should('not.include', `petId=${petProfile.id}`);

    cy.get('[data-test="deactivate-pet-profile"]')
      .should('not.exist');

    cy.get('body')
      .should('not.contain', 'Select a pet to edit');
  });
});
