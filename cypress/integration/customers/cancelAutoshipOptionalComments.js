import upcomingFulfillment from '../../fixtures/activities/autoship+upcoming_fulfillment';
import subscription from '../../fixtures/subscriptions/subscription';
import autoshipParentOrders from '../../fixtures/activities/autoship_parent_orders_active';
import cancellationReasons from '../../fixtures/activities/cancellation_reasons';

describe.skip('(CSRBT-1215): Optional cancel comments', () => {
  before(() => {
    cy.login();
    cy.intercept('/api/v1/agentNotes*', []).as('agentAlert'); // Doing this to make sure the agent popup doesn't come up
    cy.intercept('/api/v1/subscriptions/*', subscription).as('subscription');

    cy.intercept('/api/v3/autoship-activities*', autoshipParentOrders).as('autoships');
    cy.intercept('/api/v3/activities/*', upcomingFulfillment).as('activities');
    cy.intercept('/api/v1/subscriptions/cancel-reasons', cancellationReasons).as(
      'cancellationReasons',
    );

    cy.visitActivityFeed();
    cy.get(`a[href*="/app/customers/162318096/autoship"`).click();
    cy.wait('@activities');

    /**
     * Open the autoship menu for the first card
     */
    cy.get('#AutoshipCard_800040386') // TODO: this should be deterministic? I hope?
      .find('[data-testid="card:activity-header"]')
      .find('[data-testid="split-button-group"]').within(() => {
        cy.get('[data-testid="split-button-menu-button"]').click({ force: true });
      });
    cy.get('#button-menu').within(() => {
      cy.contains('Cancel Autoship').click({ force: true });
    });
  });

  it('should display reason box', () => {
    cy.get('[data-testid="autoship-cancel"]').within(() => {
      cy.contains('Cancellation Reason').should('exist');
    });
  });

  it('should enable the next button by default', () => {
    cy.get('[data-testid="autoship-cancel"]').within(() => {
      cy.get('[data-testid="base-dialog-ok-button"]').invoke('prop', 'disabled').should('eq', false);
    });
  });
  
  describe('with cancel reason of ETC', () => {
    it('should disable the next button until input entered in details', () => {
      cy.get('[data-testid="autoship-cancel"]').within(() => {
        cy.get('[data-testid="change-cancellation-reason"]').children().first().click({ force: true });
      });

      cy.get('#menu-').within(() => {
        cy.contains('Other').click({ force: true });
      });

      cy.get('[data-testid="autoship-cancel"]').within(() => {
        cy.get('[data-testid="base-dialog-ok-button"]').invoke('prop', 'disabled').should('eq', false);
        cy.get('[name="cancelReasonComments"]').should('exist').type('Unspecified reason');
        cy.contains('Next').invoke('prop', 'disabled').should('eq', false);
      });
    });
  });
});
