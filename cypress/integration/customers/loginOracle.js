/* eslint-disable jest/no-disabled-tests */
/**
 * TODO
 * This test flakes out occasionally. I think sometimes Oracle just really chugs.
 * But I didn't do a deterministic network test or anything; we might be
 * able to tune the timeouts and maybe that will help
 */
 describe.skip('login to oracle', () => {
  it('should login to Oracle', () => {
    cy.viewport(1536, 960);
    cy.visit({
      url: 'https://chewy--tst3.custhelp.com/AgentWeb/',
      method: 'GET',
      failOnStatusCode: false
    })
    // TODO get into a secret
    cy.loginOracle('pragya_tst3_automated_test', 'AutomatedP@s5w0rd', '#loginbutton');
    cy.loginBackofficeIFrameInOracle(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'));
  });
});
