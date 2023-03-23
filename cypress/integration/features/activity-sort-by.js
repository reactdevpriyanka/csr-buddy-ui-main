describe.skip('Activity feed sorting', () => {
  before(() => cy.login());

  it('should hide the activity feed sort field when disabled', () => {
    cy.feature('feature.explorer.activityFeedSortByEnabled', false);
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.get('[data-testid="activity-feed:sort-container"]').should('not.exist');
  });

  it('should display the activity feed sort field when enabled', () => {
    cy.feature('feature.explorer.activityFeedSortByEnabled', true);
    cy.visitActivityFeed();
    cy.wait('@config');
    cy.get('[data-testid="activity-feed:sort-container"]').should('exist');
  });
});
