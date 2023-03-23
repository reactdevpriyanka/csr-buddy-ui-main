/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect */

const selectors = '@selectors';

const activities = '@activities';

const orders = '@orders';

describe('/customers/:customerId/activity', () => {
  before(() => cy.login());

  const getOrder = () =>
  cy.intercept('GET', `/api/v3/order-activities/**`, {
      fixture: `/activities/order_viewdetails_totals`,
    })
    .as('orders');

  const getCustomerActivityFeed = (customerId, state = 'delivered') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/activities_orderviewdetails`,
      })
      .as('activities');

  const visitAndFetch = (customerId, state = 'delivered') => {
    getCustomerActivityFeed(customerId, state);
    cy.visitActivityFeed({ customerId });
    getOrder();

    cy.wait(orders)
    cy.wait(activities);
    };

  beforeEach(() => {
    cy.fixture('activities/activity.json').as('selectors');
  });

  describe('with delivered orders', () => {
    it('should render order title', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains('Order #1077753946').should('exist').and('be.visible');
        cy.getByTestId('ordercard:id:viewdetails:link:1077753946').click();
        cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
      });
    });
  });
});
