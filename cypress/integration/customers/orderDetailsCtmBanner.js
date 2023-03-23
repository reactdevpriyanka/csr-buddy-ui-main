import get from 'lodash/get';
import set from 'lodash/fp/set';
import successOrderFixture from '../../fixtures/activities/order_CTM_DELIVERED_DN';

const TRACKING_EVENT_PATH = 'shipments[0].trackingData.trackingEvent';

const orderFixtures = {
  success: successOrderFixture,

  warning: set(TRACKING_EVENT_PATH, {
    eventCode: 'LOST',
    subEventCode: '_LC',
  }, successOrderFixture),

  information: set(TRACKING_EVENT_PATH, {
    eventCode: 'AVAILABLE_FOR_PICKUP',
    subEventCode: '_HP',
  }, successOrderFixture),

  nonsense: set(TRACKING_EVENT_PATH, {
    eventCode: 'NONSENSE',
    subEventCode: '_LOL',
  }, successOrderFixture),
};

describe('order details CTM banner', () => {
  function visitAndFetch(state) {
    const order = orderFixtures[state];

    const { eventCode, subEventCode } = get(order, TRACKING_EVENT_PATH, {});
    cy.log(state, eventCode + subEventCode);

    cy.intercept('GET', '/api/v3/order-activities/**', order)
      .as('orderDetail');

    cy.intercept('GET', 'api/v1/orders/**', {
      fixture: '/activities/allowable_actions',
    }).as('allowableActions');

    cy.visitOrderDetailPage({
      customerId: order.customerId,
      orderId: order.id,
    });

    cy.wait(['@orderDetail', '@allowableActions']);

    cy.contains(`Order Detail #${order.id}`)
      .should('exist')
      .and('be.visible');
  }

  before(() => cy.login());

  it('should render a CTM success banner', () => {
    visitAndFetch('success');

    cy.getByTestId('shipment-tracking-banner')
      .should('exist')
      .and('be.visible');

    cy.contains('Delivered to Neighbor')
      .should('exist')
      .and('be.visible');

    cy.getByTestId('CheckIcon')
      .should('exist')
      .and('be.visible');
  });

  it('should render a CTM warning banner', () => {
    visitAndFetch('warning');

    cy.getByTestId('shipment-tracking-banner')
      .should('exist')
      .and('be.visible');

    cy.contains('Lost in Transit')
      .should('exist')
      .and('be.visible');

    cy.getByTestId('WarningAmberRoundedIcon')
      .should('exist')
      .and('be.visible');
  });

  it('should render a CTM information banner', () => {
    visitAndFetch('information');

    cy.getByTestId('shipment-tracking-banner')
      .should('exist')
      .and('be.visible');

    cy.contains('Available for Pickup')
      .should('exist')
      .and('be.visible');

    cy.getByTestId('InfoOutlinedIcon')
      .should('exist')
      .and('be.visible');
  });

  it('should render no CTM banner when given nonsense', () => {
    visitAndFetch('nonsense');

    cy.get('[data-testid="shipment-tracking-banner"]')
      .should('not.exist');
  });

  it('should open the shipment tracking drawer on button click', () => {
    visitAndFetch('success');

    cy.contains('button', 'Track Package')
      .should('exist')
      .and('be.visible')
      .click();

    cy.getByTestId('contextual-message-shipping-tracker:alert')
      .should('exist')
      .and('be.visible');
  });
});
