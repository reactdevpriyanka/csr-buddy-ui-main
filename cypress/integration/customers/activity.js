/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect */
import order from '../../fixtures/activities/order';

const selectors = '@selectors';

const activities = '@activities';

describe.skip('/customers/:customerId/activity', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId, state = 'delivered') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/activities+${state}`,
      }).as('activities');

  const getOrder = () =>
    cy
      .intercept('GET', `/api/v3/autoship-activities/**`, {
        fixture: `/activities/order`,
      }).as('orders');

  const visitAndFetch = (customerId, state = 'delivered') => {
    getCustomerActivityFeed(customerId, state);
    cy.visitActivityFeed({ customerId });
    getOrder();
    cy.wait(activities);
  };

  beforeEach(() => {
    cy.fixture('activities/activity.json').as('selectors');
  });

  describe('with delivered orders', () => {
    it('should render order title', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains(sel.delivered.orderTitle);
      });
    });

    it('should render a shipment with delivered text', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains(sel.delivered.statusText);
      });
    });

    it('should render correct items', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        for (const { name, qty, price } of sel.delivered.items) {
          cy.contains(name);
          cy.contains(qty);
          cy.contains(price);
        }
      });
    });

    it('should track package', () => {
      visitAndFetch(123123, 'delivered');
      /**
       * TODO
       *
       * The Best Way™ to test this is to allow the Cypress agent
       * to click the button and evaluate that the user is brought
       * to the correct place.
       */
    });

    it('should render placed at date', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains(sel.delivered.placedAt);
      });
    });

    it.skip('should render item type', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains(sel.delivered.tags);
      });
    });

    it('should render order details link', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains(sel.delivered.orderTitle)
          .eq(0)
          .invoke('attr', 'data-testid')
          .then((href) => {
            expect(href).contains('ordercard:id:viewdetails:link');
          });
      });
    });

    it('should render Item link', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(order).then((sel) => {
        const itemNumb = order.lineItems[0].id;
        const linkKey = `product:catalogEntryId:link:${itemNumb}`;
        cy.getByTestId(linkKey)
          .eq(0)
          .invoke('attr', 'href')
          .then((href) => {
            expect(href).to.match(/app\/dp\/\d+/);
          });
      });
    });
  });
});
