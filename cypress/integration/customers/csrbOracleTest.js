describe.skip('Smoke tests for Oracle', () => {
  before(() => {
    cy.viewport(1536, 960);
    cy.visit(`chewy--tst3.custhelp.com/AgentWeb/`);
    cy.loginOracle('pragya_tst3_automated_test', 'AutomatedP@s5w0rd', '#loginbutton');
    cy.loginBackofficeIFrameInOracle('admin', 'new123pass');
    cy.loginCSRB2InOracle('admin', 'new123pass');
  });

  beforeEach(() => {
    cy.fixture('activities/activityFeed.json').as('selectors');
  });

  const selectors = '@selectors';

  describe('smoke tests - engagement panel, activity feed, autoship tab, toast messages', () => {
    it('smoke test engagement panel elements', () => {
      cy.get("iframe[name*='CSR Buddy']").then(($firstIframe) => {
        cy.wrap($firstIframe).as('firstIframeReference');
        const $secondIframeReference = $firstIframe.contents().find("iframe[name*='csr-buddy']");
        cy.wrap($secondIframeReference).as('secondIframeReference');
        cy.get('@secondIframeReference').then(($secondIframe) => {
          const $body = $secondIframe.contents().find('body');
          cy.get(selectors).then((sel) => {
            cy.wrap($body)
              .findByTestId(`customer-sidebar:header`)
              .contains(sel.customerSideBar.customerName);
            cy.wrap($body)
              .findByTestId(`customer-sidebar:header`)
              .contains(sel.customerSideBar.createddate);
            cy.wrap($body)
              .findAllByTestId(`customer-tags-header-title`)
              .first()
              .should('be.visible');
            cy.wrap($body).findByText(`Hearing Impaired`).should('be.visible');
            cy.wrap($body).findByTestId(`customer-sidebar:form`).should('be.visible');
            cy.wrap($body).findByTestId(`customer:cid:value`).contains('162318096');
            cy.wrap($body)
              .findByTestId(`customer:email:value`)
              .contains('cypress_automation@chewy.com');
            cy.wrap($body)
              .findAllByTestId(`pet-profile:name`)
              .first()
              .scrollIntoView()
              .contains(sel.customerSideBar.petName);
            cy.wrap($body)
              .findByText(sel.customerSideBar.services)
              .scrollIntoView()
              .should('be.visible');
            cy.wrap($body)
              .findByText(sel.customerSideBar.upcomingEvents)
              .scrollIntoView()
              .should('be.visible');
            cy.wrap($body)
              .findByText(sel.customerSideBar.noUpcomingEvents)
              .scrollIntoView()
              .should('be.visible');
          });
        });
      });
    });

    it('smoke test Autoship details', () => {
      cy.get("iframe[name*='CSR Buddy']").then(($firstIframe) => {
        cy.wrap($firstIframe).as('firstIframeReference');
        const $secondIframeReference = $firstIframe.contents().find("iframe[name*='csr-buddy']");
        cy.wrap($secondIframeReference).as('secondIframeReference');
        cy.get('@secondIframeReference').then(($secondIframe) => {
          const $body = $secondIframe.contents().find('body');
          cy.get(selectors).then((sel) => {
            cy.wrap($body).findByTestId('Autoship_tab').click();
            cy.wrap($body)
              .find('div[data-testid="card:activity-header"]')
              .invoke('text')
              .then((text) => {
                expect(text).to.include(sel.order.manageAutoship);
              });
          });
        });
      });
    });
  });
});
