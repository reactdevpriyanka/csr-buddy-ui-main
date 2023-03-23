/* eslint-disable jest/valid-expect-in-promise, jest/valid-expect */

const selectors = '@selectors';

const activities = '@activities';

describe('/customers/:customerId/activity', () => {
  before(() => cy.login());

  const getCustomerActivityFeed = (customerId, state = 'delivered') =>
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/activities_orderviewdetails`,
      })
      .as('activities');

  const getOrder = () =>
    cy.intercept('GET', `/api/v3/order-activities/**`, {
        fixture: `/activities/order_viewdetails`,
      })
      .as('orders');

  const visitAndFetch = (customerId, state = 'delivered') => {
    getCustomerActivityFeed(customerId, state);
    cy.visitActivityFeed({ customerId });
    cy.wait(activities);
  };

  beforeEach(() => {
    cy.fixture('activities/activity.json').as('selectors');
  });

  describe('with delivered orders', () => {
    it('should render order title', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains('Order #1077753946').should('exist').and('be.visible');
        cy.getByTestId('ordercard:id:viewdetails:link:1077753946').click();
        cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
      });
    });
  });

  describe('with packages', () => {
    it('should render packages', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains('Order #1077753946').should('exist').and('be.visible');
        cy.getByTestId('ordercard:id:viewdetails:link:1077753946').click();
        cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
        cy.getByTestId('product:itemtype:sticker:CONNECT_WITH_A_VET').should('exist').and('be.visible');
      });
    });
  });

  describe('with item status', () => {
    it('should render item status', () => {
      visitAndFetch(162318096, 'delivered');
      cy.get(selectors).then((sel) => {
        cy.contains('Order #1077753946').should('exist').and('be.visible');
        cy.getByTestId('ordercard:id:viewdetails:link:1077753946').click();
        cy.getByTestId(`orderDetailsViewContainer`).should('exist').and('be.visible');
        cy.getByTestId('orderDetailsViewPackageProductsStatus').should('exist').and('be.visible');
      });
    });
  });

  describe.skip('action dialogs', () => {
    it('should render a functioning Add Promotion dialog', () => {
      cy.intercept('GET', `api/v1/orders/1077753946/allowable-actions`, {
        fixture: `/activities/allowable_actions`,
      }).as('allowableActions');

      visitAndFetch(162318096, 'delivered');

      cy.get(selectors).then((sel) => {
        cy.contains('Order# 1077753946').should('exist').and('be.visible');
        cy.getByTestId('ordercard:id:viewdetails:link:1077753946').click();
        cy.wait('@allowableActions');
        cy.getByTestId('button:open-add-promotion-dialog')
          .should('exist')
          .and('be.visible')
          .click();

        cy.getByTestId('order:add-promotion-dialog').should('exist').and('be.visible');

        cy.getByTestId('order:add-promotion-dialog:text-field')
          .should('be.visible')
          .type('!CSRFSX11'); // free shipping!

        cy.get('button').contains('Add promotion').should('be.visible').click();

        cy.intercept('POST', '/api/v1/orders/*/edit/promotioncode', (req) => {
          req.reply({ statusCode: 200 });
        }).as('addPromotion');

        cy.get('button')
          .contains('Yes') // confirm
          .should('be.visible')
          .click();

        cy.wait('@addPromotion');
      });
    });

    it('should render a functioning Price Adjustment dialog', () => {
      cy.intercept('GET', `api/v1/orders/1077753946/allowable-actions`, {
        fixture: `/activities/allowable_actions`,
      }).as('allowableActions');
      visitAndFetch(162318096, 'delivered');

      cy.get(selectors).then((sel) => {
        cy.contains('Order# 1077753946').should('exist').and('be.visible');
        cy.getByTestId('ordercard:id:viewdetails:link:1077753946').click();
        cy.wait('@allowableActions');

        cy.getByTestId('button:open-price-adjustment-dialog')
          .should('exist')
          .and('be.visible')
          .click();

        cy.getByTestId('order:add-adjustment-dialog').should('exist').and('be.visible');

        cy.getByTestId('order:add-adjustment-dialog:text-field').should('be.visible').type('20.23');

        // override shipping charge:
        cy.getByTestId('order:add-adjustment-dialog:checkbox').should('be.visible').click();

        cy.get('button').contains('Add adjustment').should('be.visible').click();

        cy.intercept('POST', '/api/v1/orders/*/adjustment', (req) => {
          req.reply({ statusCode: 200 });
        }).as('adjustPrice');

        cy.get('button')
          .contains('Yes') // confirm
          .should('be.visible')
          .click();

        cy.wait('@adjustPrice');
      });
    });
  });
});
