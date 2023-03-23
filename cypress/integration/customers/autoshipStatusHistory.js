import upcomingFulfillment from '../../fixtures/activities/autoship+upcoming_fulfillment';
import subscription from '../../fixtures/subscriptions/subscription';
import cancellationReasons from '../../fixtures/activities/cancellation_reasons';
import autoshipStatusHistory from '../../fixtures/activities/autoship_parent_order_status_history';

describe.skip('Autoship Cards', () => {
  const loadActivityFeedWithAutoship = ({ activity = upcomingFulfillment } = {}) => {
    cy.intercept('/api/v1/agentNotes*', []).as('agentAlert'); // Doing this to make sure the agent popup doesn't come up
    cy.intercept('/api/v1/subscriptions/*', subscription).as('subscription');

    cy.intercept('/api/v3/activities/*', activity).as('activities');
    cy.intercept('/api/v1/subscriptions/cancel-reasons', cancellationReasons).as(
      'cancellationReasons',
    );

    cy.visitActivityFeed();

    cy.wait('@cancellationReasons');
    cy.wait('@agentAlert');
    cy.wait('@activities');
  };

  before(() => {
    cy.viewport(1536, 960);
    cy.login();
  });

  describe('view autoship status history', () => {
    before(() => {
      loadActivityFeedWithAutoship();
    });

    it('should render autoship status history dialog', () => {
      cy.intercept(
        `/cs-platform/v1/subscription-service/subscriptions/800040386/statuses`,
        autoshipStatusHistory,
      ).as('autoshipStatusHistory');
      cy.getByTestId('badge:800040386').click();
      cy.wait('@autoshipStatusHistory');
      cy.get('[aria-describedby="autoship-status-history-dialog"]', { timeout: 9000 })
        .should('exist')
        .and('be.visible');
      cy.getByTestId('autoship-status-history-table', { timeout: 9000 })
        .should('exist')
        .and('be.visible');
      cy.get('tr').should('have.length', autoshipStatusHistory.data.length + 1); // need to add one to account for header
    });
  });
});
