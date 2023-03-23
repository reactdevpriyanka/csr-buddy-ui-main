describe.skip('<AlertContainer />', () => {
  before(() => {
    const customerId = '162318096';
    cy.login();
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
      fixture: `/activities/activities+delivered`,
    });
    cy.intercept('/api/v3/autoship-activities*', []);
    cy.visitActivityFeed();
    cy.get('[aria-label="comments"]').should('exist');
    cy.wait(500);
    cy.get(`[aria-label='comments']`).click({ force: false });
    cy.get(`[aria-label='create agent alert']`).click({ force: true });
  });

  describe('validate create agent alert', () => {
    it('should render title', () => {
      cy.get('h2[data-testid="alert:agent alert title"]')
        .invoke('text')
        .should('include', 'Create Agent Alert');
    });

    it('should render subtitle', () => {
      cy.get('p[data-testid="alert:agent alert paragraph"]')
        .invoke('text')
        .should(
          'include',
          'Agent Alerts are for passing critical customer or order information to the next agent(s)',
        );
    });

    it('should create a new agent alert', () => {
      cy.get('[data-testid="add-alert-type"]').find('[role="button"]').click({ force: true });
      cy.get('[data-testid="alert:type-Customer Attitude & Sentiments"]').click();
      cy.get('[data-testid="add-alert-note"]').type('This is agent alert');
      cy.get('[data-testid="save-agent-alert"]').click();
      // Clean-up
      cy.get('[data-testid*="mark-as-read-"]:first').click();
    });

    describe.skip('when canceling create an agent alert', () => {
      before(() => {
        cy.login();
        cy.visitActivityFeed();
        cy.get('[aria-label="comments"]').should('exist');
        cy.get(`[aria-label='comments']`).click({ force: false });
        cy.get(`[aria-label='create agent alert']`).click({ force: true });
      });

      it('should return to activity feed', () => {
        cy.get('[data-testid="add-agent-alert-cancel"]').click();
        cy.location('pathname').should(
          'eq',
          `/app/customers/${Cypress.env('TEST_CUSTOMER_ID')}/activity`,
        );
      });
    });
    describe('validate alert limit reached', () => {
      before(() => {
        cy.login();
        cy.intercept('/api/v3/autoship-activities*', []);
        cy.intercept('GET', `/api/v3/activities/?customerId**`, {
          fixture: `/activities/activities+delivered`,
        });
        cy.visitActivityFeed();
        cy.get('[aria-label="comments"]').should('exist');
        cy.wait(500);
        cy.get(`[aria-label='comments']`).click({ force: false });
        cy.get(`[aria-label='create agent alert']`).click({ force: true });
      });

      it.only('should display alert limit reached', () => {
        cy.get('[data-testid="add-alert-type"]').find('[role="button"]').click({ force: true });
        cy.get('[data-testid="alert:type-Customer Attitude & Sentiments"]').click();
        cy.get('[data-testid="add-alert-note"]').type('This is agent alert');
        cy.get('[data-testid="save-agent-alert"]').click();
        cy.get('[data-testid="alert:alert limit reached"]')
          .invoke('text')
          .should('include', 'Alert Limit Reached');
        // Clean-up
        cy.get('[data-testid*="mark-as-read-"]:first').click();
      });
    });
  });
});
