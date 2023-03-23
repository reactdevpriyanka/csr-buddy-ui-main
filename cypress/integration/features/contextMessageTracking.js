/* eslint-disable jest/no-disabled-tests */
const orders = '@orders';

const activities = '@activities';

/**
 * TODO
 * This test verifies issue with tracking and packageing info
 * showing for cancelled items in an order 
 * see ticket: https://chewyinc.atlassian.net/browse/CSRBT-2721
 */
describe.skip('Test Context Message Events Tracking Package', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId='268500256') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/contextMessageTrackingOrderActivities`,
      }).as('activities');

  const getOrder = () =>
    cy
      .intercept('GET', `/api/v3/order-activities/**`, {
        fixture: `/activities/contextMessageTrackingOrder`,
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

      
      cy.getByTestId('trackerContextEvent:DELIVERED_2B_DE').within(() => {
        cy.getByTestId('icon_SUCCESS').should('be.visible');
      });

      cy.getByTestId('trackerContextEvent:OUT_FOR_DELIVERY_OD').within(() => {
        cy.getByTestId('icon_DEFAULT').should('be.visible');
      });

      cy.getByTestId('trackerContextEvent:ARRIVAL_SCAN_AR').within(() => {
        cy.getByTestId('icon_DEFAULT').should('be.visible');
        cy.getByTestId('general:accordion:summary:ARRIVAL_SCAN_AR').should('have.attr','aria-expanded','true');    
      });

      cy.getByTestId('trackerContextEvent:ARRIVAL_SCAN_FD').within(() => {
        cy.getByTestId('icon_DEFAULT').should('be.visible');
        cy.getByTestId('general:accordion:summary:ARRIVAL_SCAN_FD').should('have.attr','aria-expanded','false');    

        cy.getByTestId('general:accordion:summary:ARRIVAL_SCAN_FD').click();
        cy.getByTestId('general:accordion:summary:ARRIVAL_SCAN_FD').should('have.attr','aria-expanded','true');  
      });

      cy.getByTestId('trackerContextEvent:DELIVERY_DELAYED_A7_DE').within(() => {
        cy.getByTestId('icon_WARNING').should('be.visible');
        cy.getByTestId('general:accordion:summary:DELIVERY_DELAYED_A7_DE').should('have.attr','aria-expanded','false');    

        cy.getByTestId('general:accordion:summary:DELIVERY_DELAYED_A7_DE').click();
        cy.getByTestId('general:accordion:summary:DELIVERY_DELAYED_A7_DE').should('have.attr','aria-expanded','true');  
      });

      cy.getByTestId('trackerContextEvent:ARRANGED_DELIVERY_2S_DE').within(() => {
        cy.getByTestId('icon_INFORMATION').should('be.visible');
        cy.getByTestId('general:accordion:summary:ARRANGED_DELIVERY_2S_DE').should('have.attr','aria-expanded','false');   
        
        cy.getByTestId('general:accordion:summary:ARRANGED_DELIVERY_2S_DE').click();
        cy.getByTestId('general:accordion:summary:ARRANGED_DELIVERY_2S_DE').should('have.attr','aria-expanded','true');  
      });

    });
  });

 });
