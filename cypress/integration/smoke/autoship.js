/* eslint-disable jest/no-disabled-tests */
const selectors = '@selectors';

/**
 * TODO
 * These tests will keep calling the ship now API and will cause the
 * 'we sniffed out an order' pop up which breaks things... we need
 * to figure out a better way to test this without triggering
 * (i.e. creating a fresh customer with fresh autoships periodically)
 */
describe('autoship reschedule', () => {

  before(() => {
    cy.login();
    cy.visitActivityFeed2();
    cy.fixture('activities/autoship+autoship_order_created').as('selectors');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });

  describe('autoship order', () => {
    it('should render autoship order', () => {
      cy.get(selectors).then(sel => cy.contains(sel.name));
    });

    it('should find Reschedule button', () => {
      cy.get('[data-testid="modify-autoship"]').contains('Reschedule').should('be.visible');
    });

    it('should validate change Next Shipment', () => {
      cy.get('[data-testid="modify-autoship"]').contains('Reschedule').click({ force: true });
      cy.get('[role="dialog"]',{ timeout: 10000 }).contains('Reschedule Subscription').should('be.visible');
      cy.contains('Frequency and NFD').should('be.visible');
      cy.get('[data-testid="change-frequency"]',{ timeout: 10000 }).click({force: true});
      cy.get('[data-testid="change-frequency"]',{ timeout: 10000 }).clear();
      cy.get('[data-testid="change-frequency"]',{ timeout: 10000 }).type('4');
      cy.get('button').contains('Reschedule').should('be.visible');
      cy.get('body',{ timeout: 10000 }).type('{esc}');
    });

    it('should validate Ship Now', () => {
      cy.get('[data-testid="split-button-menu-button"]:first',{ timeout: 10000 }).scrollIntoView().click({ force: true });
      cy.get('[data-testid="split-button-Ship Now:menu-item"]:first',{ timeout: 10000 }).click({ force: true });
      cy.get('[role="dialog"]',{ timeout: 10000 }).contains('Confirm Shipment').should('be.visible');
      cy.get('button').contains('Ship Now').should('be.visible');
      cy.get('body').type('{esc}');
    });

    it('should validate Skip Next Shipment', () => {
      cy.get('[data-testid="split-button-menu-button"]:first',{ timeout: 10000 }).scrollIntoView().click({ force: true });
      cy.get('[data-testid="split-button-Skip Next Shipment:menu-item"]:first',{ timeout: 10000 }).click({ force: true });
      cy.get('[role="dialog"]',{ timeout: 10000 }).contains('Skip Next Shipment').should('be.visible');
      cy.get('button').contains('Skip').should('be.visible');
      cy.get('body').type('{esc}');
    });

    it('should validate Cancel autoship', () => {
      cy.get('[data-testid="split-button-menu-button"]:first',{ timeout: 10000 }).scrollIntoView().click({ force: true });
      cy.get('[data-testid="split-button-Cancel Autoship:menu-item"]:first').click({ force: true });
      cy.get('[role="dialog"]').contains('Cancel Autoship').should('be.visible');
      cy.get('[role="dialog"]').contains('Select Cancellation Reason').should('be.visible');
      cy.get('button').contains('Next').should('be.visible');
      cy.get('body').type('{esc}');
    });

    it('should validate Change Frequency', () => {
      cy.get('[data-testid="change-frequency-uom"]',{ timeout: 10000 }).should('exist');
      cy.get('[data-testid="change-frequency-uom"]:first',{ timeout: 10000 }).should('be.visible').within(()=> {
      	cy.get('[aria-haspopup="listbox"]').click({force: true});
      });
      cy.contains('Every 3 days').click({force: true});
      cy.get('[role="dialog"]',{timeout:1000}).contains('Change Frequency').should('be.visible');
      cy.contains('Update').should('be.visible');
      cy.get('body').type('{esc}');
    });

    it('should validate cancel Change Frequency reverts selected value to original', () => {
      cy.get('[data-testid="change-frequency-uom"]').should('exist');


      // eslint-disable-next-line cypress/no-assigning-return-values
      let preVal = null;
      
      cy.get('[data-testid="change-frequency-uom"]').then((val) => {
        preVal = val[0].outerText;

        cy.get('[data-testid="change-frequency-uom"]:first',{ timeout: 10000 }).should('be.visible').within(()=> {
          cy.get('[aria-haspopup="listbox"]').click({force: true});
        }); 
        cy.contains('Every 3 days').click({force: true});

      });
    });
      });
});
