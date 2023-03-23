/* eslint-disable jest/no-disabled-tests */
const selectors = '@selectors';


const orders = '@orders';

const activities = '@activities';

const orderPaymentDetails = '@orderPaymentDetails';

describe('Test returns navigation to intiation page', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId='272404254') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/returnsNavActivities`,
      }).as('activities');

  const getOrder = () =>
    cy
      .intercept('GET', `/api/v3/order-activities/**`, {
        fixture: `/activities/returnsNavOrder`,
      }).as('orders');

  const getOrderPaymentDetails = () =>
    cy
      .intercept('GET', `api/v1/orders/order-payment-details/**`, {
        fixture: `/activities/returnsNavOrderPaymentDetails`,
      }).as('orderPaymentDetails');

  const visitAndFetch = () => {
    getCustomerActivityFeed();
    getOrder();
    cy.visitActivityFeed({ customerId:'272404254'});
    cy.wait(activities, { timeout: 10000 });
    cy.wait(orders);
  };

  beforeEach(() => {
    cy.fixture('activities/returnsNavActivity.json').as('selectors');
  });

  describe('show return item', () => {

    describe('Return item cancel button navigation', () => {
      it('should render navigate back to activity feed', () => {

        visitAndFetch();
        cy.get(selectors, { timeout: 10000 }).then((sel) => {
          cy.contains('Order #1785291502').should('exist').and('be.visible');
          getOrderPaymentDetails();

          cy.getByTestId('order-actions-button:1785291502').click({ force: true });
          cy.contains('Return Items').click({ force: true });

          cy.timeout(10000);
          cy.get('[type="radio"]').check('REPLACEMENT');

          cy.timeout(5000);
          cy.contains('button', 'Cancel').click();

          cy.timeout(10000);
          cy.contains('Order #1785291502').should('exist').and('be.visible');
        });
      });

      it('should render navigate back to order details page', () => {

        visitAndFetch();
        cy.get(selectors, { timeout: 10000 }).then((sel) => {
          cy.contains('Order #1785291502').should('exist').and('be.visible');
          getOrderPaymentDetails();
          cy.getByTestId('ordercard:id:viewdetails:link:1785291502').click();
          cy.wait(orderPaymentDetails);
          cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');

          cy.getByTestId('order-RETURN_ITEMS-cancel-1785291502').click();

          cy.timeout(10000);
          cy.get('[type="radio"]').check('REPLACEMENT');

          cy.timeout(5000);
          cy.contains('button', 'Cancel').click();

          cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
        });
      });
    });

    describe('Return item Home breadcrumb navigation', () => {
      it('should render navigate back to activity feed', () => {

        visitAndFetch();
        cy.get(selectors, { timeout: 10000 }).then((sel) => {
          cy.contains('Order #1785291502').should('exist').and('be.visible');
          getOrderPaymentDetails();

          cy.getByTestId('order-actions-button:1785291502').click({ force: true });
          cy.contains('Return Items').click({ force: true });

          cy.timeout(10000);
          cy.get('[type="radio"]').check('REPLACEMENT');

          cy.timeout(5000);
          cy.contains('a', 'Home').click();

          cy.timeout(10000);
          cy.contains('Order #1785291502').should('exist').and('be.visible');
        });
      });

      it('should render navigate back to order details page', () => {

        visitAndFetch();
        cy.get(selectors, { timeout: 10000 }).then((sel) => {
          cy.contains('Order #1785291502').should('exist').and('be.visible');
          getOrderPaymentDetails();
          cy.getByTestId('ordercard:id:viewdetails:link:1785291502').click();
          cy.wait(orderPaymentDetails);
          cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');

          cy.getByTestId('order-RETURN_ITEMS-cancel-1785291502').click();

          cy.timeout(10000);
          cy.get('[type="radio"]').check('REPLACEMENT');

          cy.timeout(5000);
          cy.contains('a', 'Home').click();

          cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
        });
      });
    });

  });

 });
