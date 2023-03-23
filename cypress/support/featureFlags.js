/**
 * Intercepts the `/gateway/configuration` API call and sets the response to include
 * the feature flag under test set to the boolean value provided by `value`.
 *
 * In order to write a deterministic test we need to wait for the `@config`
 * response to be sent, otherwise the test could time out due to network
 * issues or some other potential problem.
 *
 * ### Example
 *
 * it('should render the thingamajig when featureFlag is set to true', () => {
 *   cy.feature('featureFlag', true);
 *   cy.visit('/some/page');
 *   cy.wait('@config');
 * });
 *
 * @param  {String}  key    Key name to test
 * @param  {Boolean} value  Key value (true|false) to test
 * @return {void}
 */
Cypress.Commands.add('feature', {}, (key, value = false) => {
  cy.intercept('GET', '/gateway/configuration', { [key]: value }).as('config');
});
