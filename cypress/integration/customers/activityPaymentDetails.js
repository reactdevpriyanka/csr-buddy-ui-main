/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect */

const selectors = '@selectors';

const activities = '@activities';

const orders = '@orders';

const payments = '@payments';

describe.skip('(CSRBT-2467): Fixed ApplePay icon in payment sectios', () => {
  before(() => cy.login());

  const getOrder = () =>
  cy.intercept('GET', `/api/v3/order-activities/**`, {
      fixture: `/activities/order_viewdetails_totals`,
    })
    .as('orders');

    const getPayments = () =>
    cy.intercept('GET', `/api/v1/orders/order-payment-details/**`, {
        fixture: `/activities/order_viewdetails_payments`,
      })
      .as('payments');

  const getCustomerActivityFeed = (customerId) =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/activities_orderviewdetails`,
      })
      .as('activities');

  const visitAndFetch = (customerId) => {
    getCustomerActivityFeed(customerId);
    cy.visitActivityFeed({ customerId });
    getOrder();
    getPayments();

    cy.wait(orders)
    cy.wait(activities);
    };

  beforeEach(() => {
    cy.fixture('activities/activity.json').as('selectors');
  });

  describe('Activity Feed order with ApplePay payment', () => {
    it('should render order payment with ApplePay icon', () => {
      visitAndFetch(162318096);
      cy.get(selectors).then((sel) => {
        cy.contains('Order# 1237066053').should('exist').and('be.visible');
        cy.findAllByTestId('payment-method:label').first().should('exist').and('be.visible').contains('ApplePay');
        cy.findAllByTestId('applepay-icon').first().should('exist').and('be.visible');        
      });
    });
  });

  describe('Order Details Pade with ApplePay payment', () => {
    it('should render order payment with ApplePay icon in payments section', () => {
      visitAndFetch(162318096);
      cy.get(selectors).then((sel) => {
        cy.getByTestId('ordercard:id:viewdetails:link:1237066053').click();
        cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
        cy.getByTestId(`payment-details-label-APPLE_PAY`).should('exist').and('be.visible').contains('ApplePay');
        cy.getByTestId(`payment-details-icon-APPLE_PAY`).should('exist').and('be.visible');        
      });
    });
  });

});
