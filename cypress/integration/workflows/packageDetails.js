import SummaryPage from '../../support/pageobjects/SummaryPage';
import ActivityPage from '../../support/pageobjects/ActivityPage';
import GWF_Page from '../../support/pageobjects/GWF_Page';

describe.skip('Verify the Replace & Refund Guided Workflow', () => {
  const activityPage = new ActivityPage();
  before(() => {
    cy.login();
    cy.fixture('workflows/gwf-stg-order.json').then((body) => {
      cy.visit(
        '/app/customers/' +
          body.customerId +
          '/activity?agentProfile=DEV%20-%20CSRBuddy%20-%20Admin',
      );
    });
  });

  beforeEach(() => {
    cy.viewport(1536, 960);
    Cypress.Cookies.preserveOnce('agentProfile', 'routeKey');
  });

  it('should display correct package details for single item order', () => {
    activityPage.getOrderDetailsPage(1076639653);
    cy.get('[data-testid="toggle-sidebar-button"]').click();
    activityPage.getPackageDetailsPopup();
    cy.contains('MCI1 - Package Details 1 of 1').should('be.visible');
    cy.contains('Package Details').should('be.visible');
  });
});
