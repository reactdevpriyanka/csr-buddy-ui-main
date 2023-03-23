/* eslint-disable jest/no-disabled-tests */
const selectors = '@selectors';


const orders = '@orders';

const activities = '@activities';

/**
 * 
 * This is a testbed for recreating difficult issues commonly found
 * in Production.  Users can just over-ride the payloads from the
 * api calls into:
 *  /activities/recreateActivities.json
 *  /activities/recreateOrder
 *  /activities/recreateActivity.json
 * 
 */
describe('Test Recreate Order', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId='268500256') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/recreateActivities`,
      }).as('activities');

  const getOrder = () =>
    cy
      .intercept('GET', `/api/v3/order-activities/**`, {
        fixture: `/activities/recreateOrder`,
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
    it('should render interested order', () => {
      visitAndFetch();
      cy.contains('(Cancelled) Simparica Trio Chewable Tablet for Dogs, 22.1-44.0 lbs, (Teal Box), 6');
      cy.get('[data-testid="shipping-flow"]').should('have.length', 2);
    });
  });

 });
