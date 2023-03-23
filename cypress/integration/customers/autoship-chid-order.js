/* eslint-disable jest/no-disabled-tests */

import childOrder from '../../fixtures/activities/autoship_child_order';
import subscription from '../../fixtures/subscriptions/subscription';
import activity from '../../fixtures/activities/activities+delivered.json';

describe.skip('Autoship Child Order Cards', () => {
  const order = childOrder[0];
  const parentOrderId = order.parentOrderId;

  const loadActivityFeedWithAutoship = ({
    autoship = childOrder,
    details = subscription,
    activityFeed = activity,
  } = {}) => {
    cy.intercept('/api/v1/subscriptions/*', details).as('subscription');
    cy.intercept('/api/v3/autoship-activities/*', autoship).as('autoships')
    cy.intercept('/api/v3/activities/*', activityFeed).as('activities');

    cy.visitActivityFeed();
    cy.wait('@activities');
  };

  before(() => {
    cy.viewport(1536, 960);
    cy.login();
  });

  describe('Activity Feed Tab autoship icon', () => {
    beforeEach(() => {
      loadActivityFeedWithAutoship();
    });

    it('Autoship parent order Id should be visible', () => {
      cy.get(`[id=OrderCard_${parentOrderId}]`).should('exist').and('be.visible');
    });

  });

   

});
