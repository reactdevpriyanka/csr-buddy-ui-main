import sel from '../../fixtures/workflows/add-pet-profile';

describe.skip('<AddPetProfile />', () => {
  before(() => {
    cy.login();
    cy.visit(`/app/customers/162318096/autoship?agentProfile=DEV - CSRBuddy - Admin`);
    cy.get('body').should('exist').and('be.visible');
    cy.getByTestId('pet-profile:add-pet-button').scrollIntoView().should('exist');
    cy.getByTestId('pet-profile:add-pet-button').click({ force: true });
  });

  describe('validate Pet Profile Title', () => {
    it('should render pet profile title', () => {
      cy.get('form[data-testid="add-pet-profile"]')
        .invoke('text')
        .should('include', sel.petProfileTitle);
    });

    it('should render get information title', () => {
      cy.get('h2[data-testid="pet-general-information"]')
        .invoke('text')
        .should('include', sel.generalInfoTitle);
    });

    it('should render medication title', () => {
      cy.get('p[data-testid="pet-medication"]')
        .invoke('text')
        .should('include', sel.petMedicationTitle);
    });

    it('should render medication allergies title', () => {
      cy.get('p[data-testid="pet-allergies"]')
        .invoke('text')
        .should('include', sel.petAllergiesTitle);
    });

    it('should render health conditions title', () => {
      cy.get('p[data-testid="pet-health-condition"]')
        .invoke('text')
        .should('include', sel.petHealthTitle);
    });

    it('should render food allergies title', () => {
      cy.get('p[data-testid="pet-food-allergies"]')
        .invoke('text')
        .should('include', sel.petFoodAllergiesTitle);
    });

    it('should create a new pet profile', () => {
      cy.get('[data-testid="add-pet-name"]').type(sel.petName);

      cy.get('[data-testid="add-pet-type"]').find('[role="button"]').click({ force: true })
      // selecting this dropdown item can be flakey because this particular menu
      // takes longer to render for some reason, so wait a little longer for it.
      cy.get(`[data-testid="pet:type-${sel.petType}"]`, { timeout: 10 * 1000 })
        .scrollIntoView()
        .click({ force: true });

      cy.get('[data-testid="add-pet-breed"]').find('input').type(sel.petBreed, { force: true });

      cy.get('[data-testid="add-pet-gender"]').find('[role="button"]').click({ force: true });
      cy.contains(sel.petGender).click();

      cy.get('[data-testid="add-pet-weight"]').type(sel.weight);

      cy.contains(sel.addMedicationLinkText).scrollIntoView().click();
      cy.get('[data-testid="add-pet-medication"]').find('input').type(sel.petMedication);
      cy.contains(sel.petMedication).click({ waitForAnimations: false });
      cy.get('[data-testid="add-pet-medication"]').find('input').type('{esc}{esc}');

      cy.contains(sel.addAllergiesLinkText).scrollIntoView().click();
      cy.get('[data-testid="add-pet-allergies"]').find('input').type(sel.petAllergy);
      cy.contains(sel.petAllergy).click({ waitForAnimations: false });
      cy.get('[data-testid="add-pet-allergies"]').find('input').type('{esc}{esc}');

      cy.contains(sel.addHealthConditionLinkText).scrollIntoView().click();
      cy.get('[data-testid="add-pet-health"]').find('input').type(sel.petHealth);
      cy.contains(sel.petHealth).click({ waitForAnimations: false });
      cy.get('[data-testid="add-pet-health"]').find('input').type('{esc}{esc}');

      cy.contains(sel.addFoodAllergiesLinkText).scrollIntoView().click();
      cy.get('[data-testid="add-pet-food-allergy"]').find('input').type(sel.petFoodAllergy);
      cy.contains(sel.petFoodAllergy).click({ waitForAnimations: false });
      cy.get('[data-testid="add-pet-food-allergy"]').find('input').type('{esc}{esc}');

      cy.intercept('POST', `/api/v1/pets?customerId=${Cypress.env('TEST_CUSTOMER_ID')}`, {
        statusCode: 200,
      }).as('submit');
      cy.get('[data-testid="add-new-pet-submit"]').click();

      cy.wait('@submit');
      cy.contains(`Success! Pet profile for ${sel.petName} has been added`)
        .should('exist')
        .and('be.visible');
    });

    describe('when canceling add pet', () => {
      it('should return to activity feed', () => {
        cy.visitActivityFeed();
        cy.getByTestId('pet-profile:add-pet-button').scrollIntoView().should('exist');
        cy.getByTestId('pet-profile:add-pet-button').click({ force: true });
        cy.get('[data-testid="add-new-pet-cancel"]').click();
        cy.location('pathname').should('eq', `/app/customers/${Cypress.env('TEST_CUSTOMER_ID')}/activity`);
      });
    });
  });
});
