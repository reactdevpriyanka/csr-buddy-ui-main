/* eslint-disable jest/no-disabled-tests */
const selectors = '@selectors';


const orders = '@orders';

const activities = '@activities';

/**
 * TODO
 * This test verifies issue with tracking and packageing info
 * showing for cancelled items in an order scenario 5
 * see ticket: https://chewyinc.atlassian.net/browse/CSRBT-2705
 */
describe.skip('Test Not Shipped Items Order', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId='880167074') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/notShippedItemsOrderActivities5`,
      }).as('activities');

  const getOrder = () =>
    cy
      .intercept('GET', `/api/v3/order-activities/**`, {
        fixture: `/activities/notShippedItemsOrder5`,
      }).as('orders');

  const visitAndFetch = () => {
    getCustomerActivityFeed();
    getOrder();
    cy.visitActivityFeed({ customerId:'880167074'});
    cy.wait(activities);
    cy.wait(orders);
  };

  beforeEach(() => {
    cy.fixture('activities/recreateActivity.json').as('selectors');
  });

  describe('show order with mocked data', () => {
    it('should render interested order', () => {
      visitAndFetch();
      cy.get('[data-testid="shipping-flow"]').should('have.length', 1);
    });
  });

 });
