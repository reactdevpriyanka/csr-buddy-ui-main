describe.skip('customer tags', () => {
  before(() => {
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/order-activities/**`, []).as('orders');
    cy.intercept('GET', `/api/v3/autoship-activities/**`, []);
    cy.visitActivityFeed();
    cy.wait('@activities');
    cy.contains('Tags').should('exist').and('be.visible');
  });

  it('should render create tag button', () => {
    cy.getByTestId('edit-customer-tags').should('exist').and('be.visible');
  });

  it('should navigate to tag editor when add tag button is clicked', () => {
    cy.getByTestId('edit-customer-tags').click();
    cy.contains('Add Tags').should('exist').and('be.visible');
  });

  it('should render disabled weight options by default', () => {
    cy.get('[data-testid^="weight-10"]').each((item) => {
      cy.wrap(item).find('input').invoke('prop', 'disabled').should('eq', true);
    });
  });

  describe('when tag is checked', () => {
    const interceptTags = (customerStatus) => {
      const cid = Cypress.env('TEST_CUSTOMER_ID');
      const url = `/api/v1/customer/${cid}/tags?appliedTagsOnly=true`;
      cy.intercept(url, { fixture: `customers/customer+tags` }).as(customerStatus);
    };

    const visitAndFetch = (customerStatus) => {
      cy.intercept('GET', `/api/v3/activities/?customerId=**`, []).as('activities');
      cy.intercept('GET', `/api/v3/order-activities/**`, []).as('orders');
      cy.intercept('GET', `/api/v3/autoship-activities/**`, []);
      interceptTags(customerStatus);
      cy.visitActivityFeed();
      return cy.wait(`@${customerStatus}`);
    };

    it('should render updated tag', () => {
      visitAndFetch('active').then((_tags) => {
        cy.getByTestId('edit-customer-tags').should('exist').and('be.visible').click();
        cy.getByTestId('weight-10').should('exist');
        cy.getByTestId('weight-20').should('exist');
        cy.getByTestId('weight-30').should('exist');
        cy.getByTestId('weight-40').should('exist');
        cy.contains('Hard of Hearing').should('exist').click();
        cy.get('[name="HEARING_IMPAIRED"]').invoke('prop', 'checked').should('eq', true);
      });
    });

    beforeEach(() => {
      cy.intercept('GET', `/api/v3/activities/?customerId=**`, []).as('activities');
      cy.intercept('GET', `/api/v3/order-activities/**`, []).as('orders');
      cy.intercept('GET', `/api/v3/autoship-activities/**`, []);
    });
    it('should render a pill with tag value', () => {
      cy.contains('Back').should('exist').and('be.visible').click();
      cy.contains('Hard of Hearing').should('exist').and('be.visible');
    });

    it('should persist after opening editor', () => {
      cy.getByTestId('edit-customer-tags').should('exist').and('be.visible').click();
      cy.get('[name="HEARING_IMPAIRED"]').invoke('prop', 'checked').should('eq', true);
    });

    it('should render enabled weight options', () => {
      cy.get('[name="WEIGHT_LIMIT"]').should('exist').click();
      cy.get('[data-testid^="weight"]').each((item) => {
        cy.wrap(item).find('input').invoke('prop', 'disabled').should('eq', false);
      });

      it('should render checked radio', () => {
        visitAndFetch().then((_tags) => {
          cy.getByTestId('weight-20').should('exist').click();
          cy.getByTestId('weight-20').find('input').invoke('prop', 'checked').should('eq', true);
          cy.contains('Back').should('exist').click({ force: true });
        });
      });
    });
  });
});
