/* eslint-disable jest/no-disabled-tests */
const orders = '@orders';

const activities = '@activities';

/**
 * TODO
 * This test verifies issue with tracking and packageing info
 * showing for cancelled items in an order 
 * see ticket: https://chewyinc.atlassian.net/browse/CSRBT-2721
 */
describe('Test Context Message Events Tracking Package', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId='268500256') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/contextMessageTrackingOrderActivities`,
      }).as('activities');

  const getOrder = () =>
    cy
      .intercept('GET', `/api/v3/order-activities/**`, {
        fixture: `/activities/contextMessageTrackingAlertOrder`,
      }).as('orders');

  const visitAndFetch = () => {
    getCustomerActivityFeed();
    getOrder();
    cy.visitActivityFeed({ customerId:'268500256'});
    cy.wait(activities);
    cy.wait(orders);
  };

  beforeEach(() => {
    cy.fixture('activities/recreateActivity.json').as('selectors');
  });

  describe('show order with mocked data', () => {
    it('should render Tracking Data', () => {
      visitAndFetch();
      cy.getByTestId('shipping-flow-track-package').click();
      cy.wait(2000);
      cy.getByTestId('ordercard:id:viewdetails:link:1278400266').contains('Order #1278400266');
      cy.getByTestId('contextual-message-shipping-tracker:alert').contains('Delivery Attempted');
      cy.getByTestId('tracker-edd-package').contains('Package 1');  
      cy.getByTestId('tracker-edd-package:Delivered On').contains('Delivered On'); 
      cy.getByTestId('tracker-edd-week:Wed:Nov').contains('Wed');
      cy.getByTestId('tracker-edd-week:2022').contains('2022');
      cy.getByTestId('tracker-edd-week:23').contains('23'); 
    });
  });

 });
