/* eslint-disable jest/no-disabled-tests */
import { format } from 'date-fns';
import { frequencyUomTypesConst, getFrequency } from '../../../src/components/Autoship/constants';
import upcomingFulfillment from '../../fixtures/activities/autoship+upcoming_fulfillment';
import subscription from '../../fixtures/subscriptions/subscription';
import autoshipParentOrders from '../../fixtures/activities/autoship_parent_orders_active';
import cancellationReasons from '../../fixtures/activities/cancellation_reasons';

describe.skip('Autoship Cards', () => {
  const selector = (activity) => activity[0];

  const loadActivityFeedWithAutoship = ({
    activity = upcomingFulfillment,
    details = subscription,
    autoships = autoshipParentOrders,
    isAutoshipTab = false,
  } = {}) => {
    cy.intercept('/api/v1/agentNotes*', []).as('agentAlert'); // Doing this to make sure the agent popup doesn't come up
    cy.intercept('/api/v1/subscriptions/*', subscription).as('subscription');

    cy.intercept('/api/v3/autoship-activities*', autoships).as('autoships');
    cy.intercept('/api/v3/activities/*', activity).as('activities');
    cy.intercept('/api/v1/subscriptions/cancel-reasons', cancellationReasons).as(
      'cancellationReasons',
    );

    cy.visitActivityFeed();

    cy.get(`a[href*="/app/customers/154492684/autoship"`).click();

    cy.wait('@cancellationReasons', { timeout: 10000 });
    cy.wait('@agentAlert');
    cy.wait('@activities');
  };

  before(() => {
    cy.viewport(1536, 960);
    cy.login();
  });

  describe('all cards', () => {
    before(() => loadActivityFeedWithAutoship());

    it('should render Activity Feed and Autoship Tabs to exist', () => {
      cy.get(`a[href*="/app/customers/154492684/activity"`).should('exist').and('be.visible');
      cy.get(`a[href*="/app/customers/154492684/autoship"`).and('be.visible');
    });

    it('should render autoship title', () => {
      const activity = selector(autoshipParentOrders);
      cy.contains(`Upcoming Shipment for "${activity.name}" Autoship`).should('be.visible');
    });

    /**
     * TODO: Fix the autoship API to return this
     */
    it.skip('should render last shipment date', () => {
      // eslint-disable-line jest/no-disabled-tests
      cy.contains(`Last shipment on ${subscription.lastShipped}`, { timeout: 10000 }).should(
        'be.visible',
      );
    });

    it('should render correct number of products', () => {
      const activity = selector(autoshipParentOrders);
      cy.get('[data-testid^="card:product"]').should('have.length', activity.items.length);
    });

    it('should render subscription details', () => {
      const activity = selector(autoshipParentOrders);
      cy.contains('Subscription details').should('be.visible');
      cy.contains(`Autoship ID ${activity.id}`).should('be.visible');
      /**
       * TO-BE-FIXED - bug: autoship creation date is not displayed
       */
      //cy.contains('Autoship Created on 12/20/2021').should('be.visible');
    });

    it('should not render autoship history on Activity Feed tab', () => {
      cy.contains('SEE AUTOSHIP HISTORY').should('not.exist');
    });

    it('should render reschedule button', () => {
      cy.contains('Reschedule').should('be.visible');
    });

    it('should render next shipment date', () => {
      cy.contains('Next shipment on').should('not.contain', 'Unknown')
    });

    it('should render next order on date', () => {
      cy.contains('Next Order on:').should('be.visible');
      cy.contains('Unknown').should('not.be.visible');
    });

    describe('items', () => {
      before(() => loadActivityFeedWithAutoship());
      const autoships = autoshipParentOrders
      it('should render correct product names, quantities and prices', () => {
        const activity = selector(autoships);
        for (const item of activity.items) {
          cy.contains(item.product.name).should('be.visible');
          cy.contains(`Qty ${item.quantity}`).should('be.visible');
          cy.getByTestId("product:price").should('be.visible');
        }
      });
    });

    describe('when rescheduling NFD', () => {
      before(() => {
        loadActivityFeedWithAutoship({ isAutoshipTab: true });
        cy.get('[data-testid="modify-autoship"]', { timeout: 10000 }).click();
      });
      it('should open a pop up with subscription ID clearly visible', () => {
        cy.contains('Reschedule').should('be.visible').click();
      });

      it('should render frequency input', () => {
        cy.contains('Frequency').should('be.visible');
        cy.get('[name="fulfillmentFrequency"]').invoke('val').should('eq', '5');
      });

      it('should have render unit of measure input', () => {
        cy.contains('Units Of Measure').should('exist');
        cy.get('[name="frequencyUom"]').invoke('val').should('eq', 'WEEK');
      });

      it('should have next shipment date input', () => {
        cy.contains('Next Fulfillment Date').should('exist');
        cy.get('[name="nextFrequencyDate"]').invoke('val').should('match', /\d{4}-\d{2}-\d{2}/);
      });

      describe('when Reschedule autoship is valid', () => {
        before(() => {
          loadActivityFeedWithAutoship({ isAutoshipTab: true });
          cy.get('[data-testid="modify-autoship"]').click();
        });

        it('should not show invalid frequency by days', () => {
          cy.getByTestId('dialog-change-frequency-uom').click();

          cy.get('[data-value="DAY"]').click({ force: true });
          cy.get('[name="fulfillmentFrequency"]').type('{selectAll}5');
          cy.contains('Fulfillment frequency must not exceed 8 months').should('not.exist');
          cy.getByTestId('base-dialog-ok-button').invoke('prop', 'disabled').should('eq', false);
        });

        it('should not show invalid frequency by weeks', () => {
          cy.getByTestId('dialog-change-frequency-uom').click();

          cy.get('[data-value="WEEK"]').click({ force: true });
          cy.get('[name="fulfillmentFrequency"]').type('{selectAll}5');
          cy.contains('Fulfillment frequency must not exceed 8 months').should('not.exist');
          cy.getByTestId('base-dialog-ok-button').invoke('prop', 'disabled').should('eq', false);
        });

        it('should not show invalid frequency by months', () => {
          cy.getByTestId('dialog-change-frequency-uom').click();

          cy.get('[data-value="MON"]').click({ force: true });
          cy.get('[name="fulfillmentFrequency"]').type('{selectAll}5');
          cy.contains('Fulfillment frequency must not exceed 8 months').should('not.exist');
          cy.getByTestId('base-dialog-ok-button').invoke('prop', 'disabled').should('eq', false);
        });
      });
    });

    describe('when Reschedule autoship', () => {
      before(() => {
        loadActivityFeedWithAutoship({ isAutoshipTab: true });
        cy.get('[data-testid="modify-autoship"]').click();
      });

      it('should allow modifying the subscription and display success toast', () => {
        cy.get('[name="nextFrequencyDate"]')
          .next('div')
          .children('button')
          .eq(0)
          .click({ force: true });
        cy.get('.MuiPickersBasePicker-pickerView').within(() => {
          cy.get('.MuiPickersDay-day')
            .contains('28')
            .and('not.have.class', 'MuiPickersDay-hidden')
            .click({ force: true });
        });

        cy.intercept('PATCH', '/api/v1/subscriptions/*', {
          statusCode: 200,
          body: {
            nextFulfillmentDate: '2022-05-28T12:00:00.000Z',
          },
        });

        cy.get('[role="dialog"]').within(() => {
          cy.get('button').contains('Reschedule').closest('button').click({ force: true });
        });

        const frequency = getFrequency(5, frequencyUomTypesConst.WEEK);
        const successStr = `Autoship frequency has been updated to ${frequency}`;

        cy.getByTestId('closeIcon-sucess').should('be.visible');
        cy.contains(successStr).should('be.visible');
        cy.getByTestId('closeIcon-sucess').click({ force: true });
      });
    });

    describe('when modifying autoship', () => {
      before(() => {
        loadActivityFeedWithAutoship({ isAutoshipTab: true });
      });
      it('should open modify autoship dialog', () => {
        cy.getByTestId('split-button-menu-button').click({ force: true });
        cy.contains('Modify Autoship').click({ force: true });
        cy.contains('Change Subscription').should('be.visible');
        cy.contains('Login').should('be.visible');
        cy.contains('Change Subscription').should('be.visible');
        cy.get('.MuiDialog-container').within(
          // hack until we get a testid
          () => cy.get('[aria-label="close"]').click({ force: true }),
        );
      });
    });

    describe('when ship now is clicked', () => {
      before(() => {
        loadActivityFeedWithAutoship({ isAutoshipTab: true });
      });
      it('should open ship now dialog', () => {
        cy.getByTestId('split-button-menu-button').click({ force: true });
        cy.contains('Ship Now').click();
        cy.getByTestId('autoship-ship-now').within(() => {
          cy.contains('Confirm Shipment').should('exist');
          cy.contains('Confirm immediate shipment of Autoship ID').should('exist');
          cy.contains('#800040386').should('exist');
          cy.intercept('/api/v1/subscriptions/*/orderNow', {}).as('orderNow');
          cy.intercept('/api/v1/subscriptions/*', {
            nextFulfillmentDate: '3/14/2022',
          }).as('subscription');
          cy.contains('Ship Now').click({ force: true });
        });
        cy.wait('@orderNow');
        cy.wait('@subscription');
        cy.getByTestId('closeIcon-sucess').should('be.visible');
        cy.getByTestId('closeIcon-sucess').click({ force: true });
      });

      // TODO: More work needs to be done on the refresh of autoship tab
      it.skip('should refresh NFD', () => {
        cy.contains('Monday Mar. 14th 2022').should('be.visible');
      });
    });

    describe('when updating frequency', () => {
      before(() => {
        loadActivityFeedWithAutoship({ isAutoshipTab: true });
      });

      it.skip('should open frequency change dialog', () => {
        cy.intercept('PATCH', '/api/v1/subscriptions/*', {
          fulfillmentFrequency: 4,
          fulfillmentFrequencyUom: 'WEEK',
          nextFulfillmentDate: '3/14/2022',
        }).as('frequency');

        cy.getByTestId('change-frequency-uom')
          .click()
          .within(() => {});
        cy.findByRole('option', { name: /Every 5 weeks/i }).click();
        cy.getByTestId('autoship-change-frequency').within(() => {
          cy.contains('Change Frequency').should('be.visible');
          cy.get('button').contains('Update').closest('button').click({ force: true });
        });

        cy.wait('@frequency');
        cy.getByTestId('closeIcon-sucess').should('be.visible');
        cy.getByTestId('closeIcon-sucess').click({ force: true });
      });

      // TODO: More work needs to be done on the refresh of autoship tab
      it.skip('should update frequency UOM', () => {
        cy.getByTestId('change-frequency-uom').within(() => {
          cy.contains('Every 4 weeks').should('be.visible');
        });
      });
    });

    describe('when skipping next shipment', () => {
      it('should open skip shipment dialog', () => {
        cy.getByTestId('split-button-menu-button').click({ force: true });
        cy.contains('Skip Next Shipment').click({ force: true });
        cy.intercept('POST', '/api/v1/subscriptions/*/skip', {
          nextFulfillmentDate: '7/01/2022',
        }).as('skippedShipment');
        cy.getByTestId('autoship-skip-next').within(() => {
          cy.get('button').contains('Skip').closest('button').click({ force: true });
        });
        cy.wait('@skippedShipment');
        cy.getByTestId('closeIcon-sucess').should('be.visible');
        cy.getByTestId('closeIcon-sucess').click({ force: true });
        // TODO: More work needs to be done on the refresh of autoship tab
        // cy.contains('Next shipment on 4/22/2022').should('be.visible');
      });
    });

    describe('when Resend Email', () => {
      before(() => loadActivityFeedWithAutoship({ isAutoshipTab: true }));
      it('should open skip shipment dialog', () => {
        cy.intercept('POST', `/api/v1/notification/publish`, {}).as('resendEmail');
        cy.getByTestId('split-button-menu-button').click({ force: true });
        cy.contains('Resend Email').click({ force: true });
        cy.wait('@resendEmail');
        cy.findByTestId('snack-card-sucess').should('be.visible');
        cy.getByTestId('closeIcon-sucess').should('be.visible');
        cy.getByTestId('closeIcon-sucess').click({ force: true });
      });
    });

    describe('when cancelling subscription', () => {
      before(() => loadActivityFeedWithAutoship({ isAutoshipTab: true }));
      it.skip('should open cancel dialog', () => {
        cy.getByTestId('split-button-menu-button').click({ force: true });
        cy.contains('Cancel Autoship').click({ force: true });

        cy.getByTestId('change-cancellation-reason').click();
        cy.getByTestId('cancel-reason-option:ETC').click({ force: true });

        cy.getByTestId('autoship-cancel').within(() => {
          cy.contains('Next').should('be.enabled');
          cy.contains('Cancel Autoship').should('be.visible');

          // verify character limit of 100
          // @see {https://chewyinc.atlassian.net/browse/CSRBT-1486}
          const textarea = cy.get('[name="cancelReasonComments"]');
          const comment = 'A'.repeat(100);
          textarea.type(comment).blur();
          textarea.should('have.value', comment);
          textarea.type('A').blur(); // try typing one more character
          textarea.should('have.value', comment);

          // click 'Next' and 'Confirm' to submit the form with the first
          // autoship as a mock response, and verify success snackbar
          cy.contains('Next').click({ force: true });
          const response = autoshipParentOrders[0];
          cy.intercept('/api/v1/subscriptions/*/cancel', response).as('cancel');
          cy.root().get('button').contains('Confirm').click({ force: true });
          cy.wait('@cancel');
          cy.document().its('body').contains(`Autoship ${response.id} cancelled`);
        });
      });
    });
  });

  describe('with autoship shipment < 24 hours ago', () => {
    it('should render duplicate order popup', () => {
      const childOrdersShippedWithinLast24Hours = [
        {
          orderId: '#55512345',
          timePlaced: new Date().toJSON(),
          orderPlacedDate: new Date().toJSON(),
        },
      ];

      cy.intercept('GET', '/api/v1/subscriptions/*/orders', childOrdersShippedWithinLast24Hours).as(
        'childOrders',
      );
      loadActivityFeedWithAutoship();

      cy.getByTestId('split-button-menu-button').click({ force: true });
      cy.contains('Ship Now').click();
      cy.wait('@childOrders');
      cy.getByTestId('autoship-ship-now').within(() =>
        cy.contains('Hang on! We sniffed out a similar order').should('exist'),
      );
    });

    it('should render the correct date format', () => {
      cy.getByTestId('duplicate-placed-date').contains(format(new Date(), 'EEEE, MMMM do'));
    });
  });
});
