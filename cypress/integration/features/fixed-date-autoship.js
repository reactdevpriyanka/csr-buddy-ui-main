describe.skip('(CSRBT-1303): Fixed date autoship tag shows if tag is whitelisted', () => {
  before(() => {
    cy.feature('feature.explorer.whitelistedTags', [
      'FIXED_DATE_AUTOSHIP',
    ]);
    cy.intercept('GET', '/api/v1/customer/*/tags*', { fixture: '/customers/customer-tags-fixed-date-autoship' }).as('tags');
    cy.login();
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.wait('@tags');
  });

  it('should display fixed date autoship tag', () => {
    cy.get('[data-testid="customer-sidebar:tags"]').within(() => {
      cy.contains('Fixed Date Autoship').should('exist');
    });
  });
});

describe.skip('(CSRBT-1303): Fixed date autoship tag hidden if tag is not whitelisted', () => {
  before(() => {
    cy.feature('feature.explorer.whitelistedTags', []);
    cy.intercept('GET', '/api/v1/customer/*/tags*', { fixture: '/customers/customer-tags-fixed-date-autoship' }).as('tags');
    cy.login();
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.wait('@tags');
  });

  it('should not display fixed date autoship tag', () => {
    cy.get('[data-testid="customer-sidebar:tags"]').within(() => {
      cy.contains('Fixed Date Autoship').should('not.exist');
      cy.get('.tag').should('not.exist');
    });
  });
});
