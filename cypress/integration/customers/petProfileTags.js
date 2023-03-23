describe.skip('pet profile tags', () => {
  const interceptTags = (customerStatus) => {
    const cid = Cypress.env('TEST_CUSTOMER_ID');
    const url = `/api/v1/customer/${cid}`;
    cy.intercept(url, { fixture: `customers/customer+petProfiles` }).as(customerStatus);
  };

  const visitAndFetch = (customerStatus) => {
    interceptTags(customerStatus);
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/order-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders');
    cy.visitActivityFeed();
    cy.wait('@activities');
    cy.wait('@orders');
    return cy.wait(`@${customerStatus}`);
  };

  before(() => {
    cy.login();
  });

  describe('when pet profile tags are present', () => {
    beforeEach(() => {
      visitAndFetch('active');
    });

    it('should render medications tag', () => {
      cy.contains('Medications').should('exist').and('be.visible');
      cy.getByTestId('pet-profile-medications-83617530:tags').click();
      cy.findByRole('tooltip').should('exist').and('be.visible');
    });

    it('should render medication allergy tag', () => {
      cy.contains('Med. Allergy').should('exist').and('be.visible');
      cy.getByTestId('pet-profile-medicationallergy-83617530:tags').click();
      cy.findByRole('tooltip').should('exist').and('be.visible');
    });

    it('should render medical condition tag', () => {
      cy.contains('Med. Condition').should('exist').and('be.visible');
      cy.getByTestId('pet-profile-medicalcondition-83617530:tags').click();
      cy.findByRole('tooltip').should('exist').and('be.visible');
    });

    it.skip('should render food allergies tag', () => {
      cy.contains('Food Allergies').should('exist').and('be.visible');
      cy.getByTestId('pet-profile-foodallergies-83617530:tags').click();
      cy.findByRole('tooltip').should('exist').and('be.visible');
    });
  });
});
