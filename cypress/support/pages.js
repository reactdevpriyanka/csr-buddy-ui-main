Cypress.Commands.add('visitActivityFeed', {}, ({ customerId = null, profile = null } = {}) => {
  const cID = customerId || Cypress.env('TEST_CUSTOMER_ID');
  const agentProfile = profile || Cypress.env('AGENT_PROFILE');
  // cy.visit(`/app/customers/${cID}/activity`, { qs: { agentProfile } });
  cy.visit({ url: `/app/customers/${cID}/activity`, qs: { agentProfile }, timeout: 200000 });
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('eq', `/app/customers/${cID}/activity`);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});

Cypress.Commands.add('visitActivityFeed2', {}, ({ customerId = null, profile = null } = {}) => {
  const cID = customerId || Cypress.env('TEST_CUSTOMER_ID2');
  const agentProfile = profile || Cypress.env('AGENT_PROFILE');
  // cy.visit(`/app/customers/${cID}/activity`, { qs: { agentProfile } });
  cy.visit({ url: `/app/customers/${cID}/activity`, qs: { agentProfile }, timeout: 200000 });
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('eq', `/app/customers/${cID}/activity`);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});

Cypress.Commands.add('withPanel', {}, ({ customerId = null, profile = null, interactionPanel = 'default' } = {}) => {
  const cID = customerId || Cypress.env('TEST_CUSTOMER_ID');
  const agentProfile = profile || Cypress.env('AGENT_PROFILE');
  // cy.visit(`/app/customers/${cID}/activity`, { qs: { agentProfile, interactionPanel } });
  cy.visit({ url: `/app/customers/${cID}/activity`, qs: { agentProfile, interactionPanel } , timeout: 200000});
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('contain', `/app/customers/${cID}/activity`);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});

Cypress.Commands.add('visitOrderDetailPage', {}, ({ customerId, orderId }) => {
  const cID = customerId || Cypress.env('TEST_CUSTOMER_ID');
  const agentProfile = Cypress.env('AGENT_PROFILE');
  const pageUrl = `/app/customers/${cID}/orders/${orderId}`;
  cy.visit({ url: pageUrl, qs: { agentProfile }, timeout: 200000 });
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('eq', pageUrl);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});

Cypress.Commands.add('visitGiftCardsAndPromotionsPage', {}, ({ customerId = 255830297, profile = null } = {}) => {
  const cID = customerId || Cypress.env('TEST_CUSTOMER_ID');
  const agentProfile = profile || Cypress.env('AGENT_PROFILE');
  cy.visit({ url: `/app/customers/${cID}/giftcards-promotions`, timeout: 200000 });
  // cy.visit(`/app/customers/${cID}/giftcards-promotions`, { qs: { agentProfile } });
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('eq', `/app/customers/${cID}/giftcards-promotions`);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});

Cypress.Commands.add('visitFindUser', {}, ({ loginId = null, profile = null } = {}) => {
  const agentProfile = profile || Cypress.env('AGENT_PROFILE');
  // cy.visit(`/app/users/find-users`, { qs: { agentProfile } });
  cy.visit({ url: `/app/users/find-users`, qs: { agentProfile }, timeout: 200000 });
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('eq', `/app/users/find-users`);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});

Cypress.Commands.add('visitCreateModifyUser', {}, ({ loginId = null, profile = null } = {}) => {
  const cID = loginId || Cypress.env('TEST_LOGON_ID');
  const agentProfile = profile || Cypress.env('AGENT_PROFILE');
  // cy.visit(`/app/users/create-modify-user`, { qs: { loginId: cID, agentProfile} });
  cy.visit({ url: `/app/users/create-modify-user`, qs: { loginId: cID, agentProfile }, timeout: 200000 });
  // wait for the URL to change before queuing the next command
  cy.location('pathname').should('eq', `/app/users/create-modify-user`);
  cy.get('body').should('exist').and('be.visible'); // wait for the DOM content to return
});
