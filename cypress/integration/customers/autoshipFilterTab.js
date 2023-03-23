describe.skip('autoship parent order tab', () => {
  const CANCELLED_STATE = 'cancelled';
  const ACTIVE_STATE = 'active';
  const autoshipParentOrders = '@autoshipParentOrders';
  const customerId = Cypress.env('TEST_CUSTOMER_ID');

  const interceptTags = (state) => {
    const url = `/api/v2/activities/autoship?customerId=${customerId}`;
    cy.intercept(url, { fixture: `activities/autoship_parent_orders_${state}` })
      .as('autoshipParentOrders');
  };

  const visitAndFetch = (state = ACTIVE_STATE) => {
    interceptTags(state);
    cy.visitActivityFeed();
    cy.getByTestId('Autoship_tab').click({force: true});
    cy.wait(autoshipParentOrders);
  };

  before(() => cy.login());

  it('should render filter tabs', () => {
    visitAndFetch();
    cy.get('[data-testid="Activity Feed_tab"]', { timeout: 9000 }).should('exist').and('be.visible');
    cy.get('[data-testid="Autoship_tab"]', { timeout: 9000 }).should('exist').and('be.visible');
    cy.get('[data-testid="Activity Feed_tab"]', { timeout: 9000 }).should('not.have.class','active');
    cy.get('[data-testid="Autoship_tab"]', { timeout: 9000 }).should('have.class','active');
  });

  describe('Active autoship card', () => {
    before(() => visitAndFetch());

    it('should render active autoship card', () => {
      cy.getByTestId('card').should('exist').and('be.visible');
    });
  
    it('should not render cancelled autoship card', () => {
      cy.findByTestId('cardDisabled').should('not.exist');
    });
  });

  describe('Canceleled autoship card', () => {
    before(() => visitAndFetch(CANCELLED_STATE));

    it('should render cancelled autoship card', () => {
      cy.findByTestId('cardDisabled').should('exist').and('be.visible');
    });

    it('should render cancelled autoship card frequency_dropdown disabled', () => {
      cy.findByTestId('change-frequency-uom').invoke('css', 'pointer-events').should('equal', 'none');
    });

    it('should render cancelled autoship card reschedule link disabled', () => {
      cy.findByTestId('modify-autoship').invoke('css', 'pointer-events').should('equal', 'none');
    });

    it('should render cancelled autoship card manage autoship split button disabled', () => {
      cy.findByTestId('split-button-label').invoke('css', 'pointer-events').should('equal', 'none');
    });
  });
});
