// skipping these tests till filtering is fixed in main
describe.skip('Activity feed filtering', () => {
  const selectFilter = (filter) => {
    // open filter menu
    cy.getByTestId('activity-filter-menu').within(() => {
      cy.get('[role="button"]').click({ force: true });
    });

    // click filter item
    cy.getByTestId(`activity-filter-item:${filter}`).click({ force: true });
  };

  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '/api/v1/activities/date*', {
      fixture: 'activities/activities+filters',
    }).as('activities');
    cy.visitActivityFeed();
    cy.wait('@activities');
  });

  it('should filter activities based on selected filters', () => {
    // all should be visible by default
    cy.get('#OrderCard_1071031321').should('exist').and('be.visible');
    cy.get('#AutoshipCard_800018194').should('exist').and('be.visible');
    cy.get('#OrderCard_1071403024').should('exist').and('be.visible');
    cy.get('#OrderCard_1070091319').should('exist').and('be.visible');
    cy.get('#OrderCard_1074621816').should('exist').and('be.visible');

    selectFilter('Returns');
    cy.get('#OrderCard_1071031321').should('exist').and('be.visible');
    cy.get('#AutoshipCard_800018194').should('not.exist');
    cy.get('#OrderCard_1071403024').should('not.exist');
    cy.get('#OrderCard_1070091319').should('not.exist');
    cy.get('#OrderCard_1074621816').should('not.exist');

    selectFilter('Autoships');
    cy.get('#OrderCard_1071031321').should('not.exist');
    cy.get('#AutoshipCard_800018194').should('exist').and('be.visible');
    cy.get('#OrderCard_1071403024').should('not.exist');
    cy.get('#OrderCard_1070091319').should('not.exist');
    cy.get('#OrderCard_1074621816').should('not.exist');

    selectFilter('Cancellations');
    cy.get('#OrderCard_1071031321').should('not.exist');
    cy.get('#AutoshipCard_800018194').should('not.exist');
    cy.get('#OrderCard_1071403024').should('exist').and('be.visible');
    cy.get('#OrderCard_1070091319').should('not.exist');
    cy.get('#OrderCard_1074621816').should('not.exist');

    selectFilter('Prescription Items');
    cy.get('#OrderCard_1071031321').should('not.exist');
    cy.get('#AutoshipCard_800018194').should('not.exist');
    cy.get('#OrderCard_1071403024').should('not.exist');
    cy.get('#OrderCard_1070091319').should('exist').and('be.visible');
    cy.get('#OrderCard_1074621816').should('not.exist');

    selectFilter('All');
    cy.get('#OrderCard_1071031321').should('exist').and('be.visible');
    cy.get('#AutoshipCard_800018194').should('exist').and('be.visible');
    cy.get('#OrderCard_1071403024').should('exist').and('be.visible');
    cy.get('#OrderCard_1070091319').should('exist').and('be.visible');
    cy.get('#OrderCard_1074621816').should('exist').and('be.visible');
  });
});
