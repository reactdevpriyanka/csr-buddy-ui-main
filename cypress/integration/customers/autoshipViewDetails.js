import { currencyFormatter } from '../../../src/utils/string';
import upcomingFulfillment from '../../fixtures/activities/autoship+upcoming_fulfillment';
import subscription from '../../fixtures/subscriptions/subscription';
import cancellationReasons from '../../fixtures/activities/cancellation_reasons';
import autoships from '../../fixtures/activities/autoship_parent_orders_active';


describe.skip('Autoship View Details', () => {
  const loadActivityFeedWithAutoship = ({
    activity = upcomingFulfillment,
    subscriptions = subscription,
  } = {}) => {
    cy.intercept('/api/v1/agentNotes*', []).as('agentAlert'); // Doing this to make sure the agent popup doesn't come up
    cy.intercept('/api/v1/subscriptions/*', subscriptions).as('subscription');

    cy.intercept('/api/v3/activities/*', activity).as('activities');
    cy.intercept('/api/v1/subscriptions/cancel-reasons', cancellationReasons).as('cancellationReasons');
    cy.visitActivityFeed();

    cy.wait('@cancellationReasons');
    cy.wait('@agentAlert');
    cy.wait('@activities');
  };

  before(() => {
    cy.viewport(1536, 960);
    cy.login();
  });

  describe('view autoship details', () => {
    before(() => {
      loadActivityFeedWithAutoship()
      cy.getByTestId('autoship:payment:viewdetails:link:label:800040386').click();
      cy.getByTestId('autoship-view-details').should('exist').and('be.visible');
      cy.getByTestId('autoship:payment:viewdetails:adjustment:accordion:details').should('exist').and('not.be.visible');
      cy.getByTestId('autoship:payment:viewdetails:adjustment:accordion').click();
      cy.getByTestId('autoship:payment:viewdetails:adjustment:accordion:details').should('exist').and('be.visible');
    
    });

    it('should render autoship title', () => {
      cy.getByTestId('autoship-view-details').contains(`Autoship "Autoship #1" Details`).should('be.visible')
    });

    it('should render subscription details', () => {
      cy.getByTestId('autoship-view-details').contains(`Frequency: Every 5 weeks`).should('be.visible');
      cy.getByTestId('autoship-view-details').contains('Next shipment on').should('not.contain', 'Unknown')
      cy.getByTestId('autoship-view-details').contains('Last shipment on').should('not.contain', 'Unknown')
      cy.getByTestId('autoship-view-details').contains(`Autoship ID: 800040386`).should('be.visible');    
    });

    describe('items', () => {
      it('should render correct product quantities and prices', () => {
        for (const item of autoships[0].items) {
          cy.getByTestId('autoship-view-details').contains(`Qty: ${item.quantity}`).should('be.visible');
          cy.getByTestId('totalProduct_value').invoke('text').should('match', /\d{2}.\d{2}/);
        }
      });
    });

    describe('amount totals', () => {
      it('should render correct summary totals', () => {
        const autoship = autoships[0];
        cy.getByTestId('totalProduct_value').invoke('text').should('match', /\d{2}.\d{2}/);
        cy.getByTestId('totalShipping_value').invoke('text').should('match', /\d{1}.\d{2}/);
        cy.getByTestId('totalAdjustment_value').invoke('text').should('match', /\d{1}.\d{2}/);
        cy.getByTestId('totalBeforeTax_value').invoke('text').should('match', /\d{2}.\d{2}/);
        cy.getByTestId('totalTax_value').invoke('text').should('match', /\d{1}.\d{2}/);
        cy.getByTestId('totalOrder_value').invoke('text').should('match', /\d{2}.\d{2}/);

        for (const item of autoship.items) {
          cy.getByTestId('autoship-view-details').contains(`Qty: ${item.quantity}`).should('be.visible');
          cy.getByTestId('totalProduct_value').invoke('text').should('match', /\d{2}.\d{2}/);
        }

      });
    });

  });
});
