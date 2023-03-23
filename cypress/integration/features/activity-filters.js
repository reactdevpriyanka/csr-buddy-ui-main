describe.skip('Activity feed filters', () => {
  before(() => cy.login());

  it('should hide the activity feed filters when disabled', () => {
    cy.feature('feature.explorer.activityFeedFiltersEnabled', false);
    cy.visitActivityFeed();
    cy.get('[data-testid="activity-filters"]').should('not.exist');
  });

  it('should display the activity feed filters when enabled', () => {
    cy.feature('feature.explorer.activityFeedFiltersEnabled', true);
    cy.get('[data-testid="activity-filters"]').should('exist').and('be.visible');
  });
});
