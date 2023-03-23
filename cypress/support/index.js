// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-axe';

// Import commands.js using ES2015 syntax:
import './commands';
import './pages';
import './autoship';

Cypress.Cookies.debug(true);
Cypress.Cookies.defaults({ preserve: 'SESSION' });

Cypress.on('window:before:load', function (window) {
    const original = window.EventTarget.prototype.addEventListener
  
    window.EventTarget.prototype.addEventListener = function () {
      if (arguments && arguments[0] === 'beforeunload') {
        return
      }
      return original.apply(this, arguments)
    }
  
    Object.defineProperty(window, 'onbeforeunload', {
      get: function () { },
      set: function () { }
    })
  })

// Alternatively you can use CommonJS syntax:
// require('./commands')

// TODO: Really need to fix this.
// Ideally we would have a smoke test suite and an integration suite.
// Smoke tests should cover E2E and integration can use mocks.
// We have a mix of both approaches in the same suite.
//before(() => {
//  cy.login();
//  // reset autoships to expected frequencies and ship dates
//  const customerId = Cypress.env('TEST_CUSTOMER_ID');
//  cy.request('GET', `/api/v1/activities?customerId=${customerId}`).its('body').then(body => {
//    const autoshipActivity = body.find(activity => activity.data.autoship);
//    if (autoshipActivity) {
//      cy.updateAutoship(autoshipActivity.data.autoship.id, { fulfillment_frequency: 4, fulfillment_uom: 'DAY' });
//    }
//  });
//});
