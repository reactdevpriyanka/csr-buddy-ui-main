Cypress.Commands.add('updateAutoship', {}, (autoshipId, body, customerId = null) => {
  cy.request({
    method: 'PATCH',
    url: `/api/v1/subscriptions/${autoshipId}`,
    headers: {
      'X-User-Id': `${customerId || Cypress.env('TEST_CUSTOMER_ID')}`,
    },
    body,
  });
});
