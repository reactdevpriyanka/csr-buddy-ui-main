/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect */

const selectors = '@selectors';

describe('/customers/:customerId/activity', () => {

  beforeEach(() => {
    cy.fixture('activities/activity.json').as('selectors');
  });
 });

    it('should render order details link', () => {
      cy.login();
      cy.visit({ url: '/app/customers/154492684/activity?agentProfile=DEV+-+CSRBuddy+-+Admin', timeout: 120000 });
    });

