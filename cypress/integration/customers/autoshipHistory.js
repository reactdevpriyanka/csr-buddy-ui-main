describe.skip('autoship parent order tab', () => {

  const ACTIVE_STATE = 'active';
  const autoshipParentOrders = '@autoshipParentOrders';
  const autoshipChildOrders = '@autoshipChildOrders';
  const customerId = '162318096';
  const subscriptionId = '800040386';

  const interceptSubscriptions = () => {
    const url = `/api/v1/subscriptions/*`;
    cy.intercept(url, { fixture: `activities/autoship_child_orders` })
      .as('autoshipChildOrders');
  };


  const interceptTags = (state) => {
    const url = '/api/v3/autoship-activities/*';
    cy.intercept(url, { fixture: `activities/autoship_parent_orders_${state}` })
      .as('autoshipParentOrders');
  };

  const visitAndFetch = (state = ACTIVE_STATE) => {
    cy
      .intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/autoship_history_activity`,
      })
      .as('activities');
    interceptSubscriptions();
    cy.visitActivityFeed();
    cy.getByTestId('closeIcon-warning').click();
    cy.get(`a[href*="/app/customers/162318096/autoship"`).click();
  };

  before(() => cy.login());

  it('should render autoship history modal', () => {
    visitAndFetch();
    cy.getByTestId(`autoship-history-${subscriptionId}`).click();
    cy.wait(autoshipChildOrders);
    cy.get('[data-testid="modal-section"]', { timeout: 9000 }).should('exist').and('be.visible');

  });

  describe('Hover over info icon', () => {
    before(() => visitAndFetch());

    it('should render info popup', () => {
      cy.getByTestId(`autoship-history-${subscriptionId}`).click();
      cy.getByTestId('summary-poppup-button-1076530819').scrollIntoView().click();      
    });

  });

  describe('Hover over product 1 name', () => {
    before(() => visitAndFetch());

    it.only('should render tooltip with product info', () => {
      cy.getByTestId(`autoship-history-${subscriptionId}`).click();
      cy.getByTestId('order-item-product-394792513-46861').click();
    });

  });
});
