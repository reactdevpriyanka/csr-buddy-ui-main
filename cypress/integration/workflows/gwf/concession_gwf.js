import ActivityPage from '../../../support/pageobjects/ActivityPage';
import GWF_Page from '../../../support/pageobjects/GWF_Page';

describe.skip('Verify the Concession Guided Workflow', () => {
  const activityPage = new ActivityPage();
  const gwfPage = new GWF_Page();
  let orderId, itemName, itemQuantity, itemNumber, itemUnitPrice;

  before(() => {
    cy.login();
    cy.fixture('workflows/gwf-stg-order.json').then((body) => {
      orderId = body.orderId;
      itemName = body.name;
      itemQuantity = body.quantity;
      itemNumber = body.partNumber;
      itemUnitPrice = body.unitPrice;
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

  it('should display appropriate fields when Concession is selected', () => {
    activityPage.getGwfPageForOrder(orderId);
    cy.contains('Fix an Issue: Order #' + orderId + '', { timeout: 20000 }).should('be.visible');
    gwfPage.getConcessionRadioBtn().click();
    cy.contains('Choose Item(s)').should('be.visible');
    gwfPage.getSelectAllCheckBox().should('not.be.checked');
    gwfPage.getProductCheckBox().should('not.be.checked');
    gwfPage.getShippingCheckBox().should('not.be.checked');
    cy.contains('Product').should('be.visible');
    cy.contains('Remaining amt').should('be.visible');
    gwfPage.getProductCheckBox().should('not.be.checked');
    cy.contains('ITEM #' + itemNumber + '').should('be.visible');
    cy.contains(itemName).should('be.visible');
    cy.contains(itemName)
      .next()
      .invoke('text')
      .should('contain', 'Qty Ordered: ' + itemQuantity + '');
    cy.contains('Shipping').should('be.visible');
    cy.contains('Concession to be given').should('be.visible');
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .should('contain', 'concession amount');
    gwfPage.getConcessionAmountTextBox().should('have.value', '$0.00');
    cy.contains('Concession Details').should('be.visible');
    cy.contains('Concession Details').next().invoke('text').should('contain', 'Return Reason');
    cy.contains('At least one item must be selected to continue.').should('be.visible');
    gwfPage.getCancelButton().should('be.enabled');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
  });

  it('should display appropriate fields when Select All is selected', () => {
    //cy.contains('span', 'Select all').click();
    gwfPage.getSelectAllCheckBox().check();
    gwfPage.getSelectAllCheckBox().should('be.checked');
    gwfPage.getProductCheckBox().should('be.checked');
    gwfPage.getShippingCheckBox().should('be.checked');
    gwfPage
      .getProductConcessionDetails()
      .contains('Unit $')
      .next()
      .invoke('text')
      .should('contain', itemUnitPrice);
    gwfPage
      .getProductConcessionDetails()
      .contains('QTY ordered')
      .next()
      .invoke('text')
      .should('contain', 1);
    gwfPage.getProductConcessionDetails().contains('Discount').should('be.visible');
    gwfPage.getProductConcessionDetails().contains('Total').should('be.visible');
    gwfPage.getProductConcessionDetails().contains('Previous Con.').should('be.visible');
    gwfPage.getProductConcessionDetails().contains('Remaining amt').should('be.visible');
    gwfPage
      .getShippingConcessionDetails()
      .contains('Flat rate')
      .next()
      .invoke('text')
      .should('contain', '4.95');
    gwfPage.getShippingConcessionDetails().contains('Total').should('be.visible');
    gwfPage.getShippingConcessionDetails().contains('Previous Con.').should('be.visible');
    gwfPage.getShippingConcessionDetails().contains('Remaining amt').should('be.visible');
    cy.contains('Please enter concession amount to continue.').should('be.visible');
    gwfPage.getCancelButton().should('be.enabled');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
  });

  it('should display appropriate Concession Amount error when Select All is selected', () => {
    let prodAmount, shipAmount;
    gwfPage
      .getProductConcessionDetails()
      .contains('Remaining amt')
      .next()
      .invoke('text')
      .then((text) => {
        prodAmount = Number(text.replace('$', ''));
      });
    gwfPage
      .getShippingConcessionDetails()
      .contains('Remaining amt')
      .next()
      .invoke('text')
      .then((text) => {
        shipAmount = Number(text.replace('$', ''));
      });
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .type(prodAmount + shipAmount);
        cy.contains('Concession Details').click();
        cy.contains('Please select a return reason to continue.').should('be.visible');
      });
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .clear()
          .type(prodAmount + shipAmount + 1);
        cy.contains('Concession Details').click();
        cy.contains('Concession must not exceed the remaining amount.').should('be.visible');
      });
    cy.contains('div', 'Return Reason').click();
    cy.contains('Unauthorized Purchase').should('be.visible').click();
    gwfPage
      .getPrimaryReasonDropDown()
      .eq(0)
      .invoke('text')
      .should('have.string', 'Unauthorized Purchase');
    gwfPage.getAdditionalCommentsTextBox().clear().type('TEST COMMENT');
    cy.contains('Concession must not exceed the remaining amount.').should('be.visible');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .clear()
          .type(prodAmount + shipAmount - 1);
        cy.contains('Concession Details').click();
      });
    gwfPage.getViewSummaryButton().should('be.enabled');
  });

  it('should display appropriate fields when UnSelect All is selected', () => {
    cy.contains('span', 'Select all').click();
    gwfPage.getSelectAllCheckBox().should('not.be.checked');
    gwfPage.getProductCheckBox().should('not.be.checked');
    gwfPage.getShippingCheckBox().should('not.be.checked');
    cy.contains('At least one item must be selected to continue.').should('be.visible');
    cy.get('input[type="text"]').click().clear();
    cy.contains('div', 'Return Reason').click();
    cy.contains('None').should('be.visible').click();
  });

  it('should display appropriate fields when Product item is selected', () => {
    gwfPage.getProductCheckBox().click();
    gwfPage.getSelectAllCheckBox().should('not.be.checked');
    gwfPage.getProductCheckBox().should('be.checked');
    gwfPage.getShippingCheckBox().should('not.be.checked');
    gwfPage
      .getProductConcessionDetails()
      .contains('Unit $')
      .next()
      .invoke('text')
      .should('contain', itemUnitPrice);
    gwfPage
      .getProductConcessionDetails()
      .contains('QTY ordered')
      .next()
      .invoke('text')
      .should('contain', 1);
    gwfPage.getProductConcessionDetails().contains('Discount').should('be.visible');
    gwfPage.getProductConcessionDetails().contains('Total').should('be.visible');
    gwfPage.getProductConcessionDetails().contains('Previous Con.').should('be.visible');
    gwfPage.getProductConcessionDetails().contains('Remaining amt').should('be.visible');
    cy.contains('div', 'Flat rate').should('not.exist');
    cy.contains('Please enter concession amount to continue.').should('be.visible');
    cy.contains('button', 'Cancel').should('be.enabled');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
  });

  it('should display appropriate Concession Amount error when Product Item is selected', () => {
    let prodAmount;
    gwfPage
      .getProductConcessionDetails()
      .contains('Remaining amt')
      .next()
      .invoke('text')
      .then((text) => {
        prodAmount = Number(text.replace('$', ''));
      });
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]').click().type(prodAmount);
        cy.contains('Concession Details').click();
        cy.contains('Please select a return reason to continue.').should('be.visible');
      });
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .clear()
          .type(prodAmount + 1);
        cy.contains('Concession Details').click();
        cy.contains('Concession must not exceed the remaining amount.').should('be.visible');
      });
    cy.contains('div', 'Return Reason').click();
    cy.contains('Unauthorized Purchase').should('be.visible').click();
    gwfPage
      .getPrimaryReasonDropDown()
      .eq(0)
      .invoke('text')
      .should('have.string', 'Unauthorized Purchase');
    gwfPage.getAdditionalCommentsTextBox().clear().type('TEST COMMENT');
    cy.contains('Concession must not exceed the remaining amount.').should('be.visible');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .clear()
          .type(prodAmount - 1);
        cy.contains('Concession Details').click();
      });
    gwfPage.getViewSummaryButton().should('be.enabled');
  });

  it('should display appropriate fields when Shipping item is selected', () => {
    gwfPage.getProductCheckBox().click();
    cy.get('input[type="text"]').click().clear();
    cy.contains('div', 'Return Reason').click();
    cy.contains('None').should('be.visible').click();
    gwfPage.getShippingCheckBox().click();
    gwfPage.getSelectAllCheckBox().should('not.be.checked');
    gwfPage.getProductCheckBox().should('not.be.checked');
    gwfPage.getShippingCheckBox().should('be.checked');
    cy.contains('div', 'Unit $').should('not.exist');
    gwfPage
      .getShippingConcessionDetails()
      .contains('Flat rate')
      .next()
      .invoke('text')
      .should('contain', '4.95');
    gwfPage.getShippingConcessionDetails().contains('Total').should('be.visible');
    gwfPage.getShippingConcessionDetails().contains('Previous Con.').should('be.visible');
    gwfPage.getShippingConcessionDetails().contains('Remaining amt').should('be.visible');
    cy.contains('Please enter concession amount to continue.').should('be.visible');
    gwfPage.getCancelButton().should('be.enabled');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
  });

  it('should display appropriate Concession Amount error when Shipping Item is selected', () => {
    let shipAmount;
    gwfPage
      .getShippingConcessionDetails()
      .contains('Remaining amt')
      .next()
      .invoke('text')
      .then((text) => {
        shipAmount = Number(text.replace('$', ''));
      });
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]').click().type(shipAmount);
        cy.contains('Concession Details').click();
        cy.contains('Please select a return reason to continue.').should('be.visible');
      });
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .clear()
          .type(shipAmount + 1);
        cy.contains('Concession Details').click();
        cy.contains('Concession must not exceed the remaining amount.').should('be.visible');
      });
    cy.contains('div', 'Return Reason').click();
    cy.contains('Unauthorized Purchase').should('be.visible').click();
    gwfPage
      .getPrimaryReasonDropDown()
      .eq(0)
      .invoke('text')
      .should('have.string', 'Unauthorized Purchase');
    gwfPage.getAdditionalCommentsTextBox().clear().type('TEST COMMENT');
    cy.contains('Concession must not exceed the remaining amount.').should('be.visible');
    gwfPage.getViewSummaryButton().should('not.be.enabled');
    cy.contains('Concession to be given')
      .next()
      .invoke('text')
      .then((text) => {
        cy.get('input[type="text"]')
          .click()
          .clear()
          .type(shipAmount - 1);
        cy.contains('Concession Details').click();
      });
    gwfPage.getViewSummaryButton().should('be.enabled');
  });

  it('should display correct Concession amount on Summary Page', () => {
    cy.intercept({
      method: 'POST',
      url:
        'https://csrb-gateway.csbb.stg.chewy.com/api/v1/gwf/version/2/name/returns-continueToSummary',
    }).as('payDetails');
    cy.get('input[type="text"]').click().clear().type(2);
    gwfPage
      .getPrimaryReasonDropDown()
      .eq(0)
      .invoke('text')
      .should('have.string', 'Unauthorized Purchase');
    gwfPage.getAdditionalCommentsTextBox().clear().type('TEST COMMENT');
    gwfPage.getViewSummaryButton().click();
    let summary, payDetails;
    cy.wait('@payDetails').should(({ request, response }) => {
      summary = response.body.context.summaryDetails;
      payDetails = response.body.context.summaryDetails.paymentMethods[0].card;
    });
    cy.get('#gwf-form').within((body) => {
      cy.contains('Review and Finalize').should('be.visible');
      cy.contains('Concession Summary').should('be.visible');
      cy.contains('Total Concession').should('be.visible');
      cy.contains('$' + summary.totalRefund).should('be.visible');
      cy.contains('Refund To').should('be.visible');
      cy.contains(payDetails.cardHolderName).should('be.visible');
      cy.contains(payDetails.type + ' ending in ' + payDetails.accountNumber.slice(-4)).should(
        'be.visible',
      );
      cy.contains('Exp ' + payDetails.expirationMonth + '/' + payDetails.expirationYear).should(
        'be.visible',
      );
      cy.contains('Special Requests').should('be.visible');
      cy.contains('Delivery complaints and shipping instructions').should('be.visible');
    });
  });

  it('should display correct Concession amount on Summary Page for product', () => {
    cy.intercept({
      method: 'POST',
      url:
        'https://csrb-gateway.csbb.stg.chewy.com/api/v1/gwf/version/2/name/returns-continueToSummary',
    }).as('payDetails');
    cy.contains('Questions').click();
    cy.get('input[type="text"]').click().clear().type(3);
    cy.contains('Concession Details').click();
    gwfPage.getViewSummaryButton().click();
    let summary, payDetails;
    cy.wait('@payDetails').should(({ request, response }) => {
      summary = response.body.context.summaryDetails;
      payDetails = response.body.context.summaryDetails.paymentMethods[0].card;
    });
    cy.get('#gwf-form').within((body) => {
      cy.contains('Review and Finalize').should('be.visible');
      cy.contains('Concession Summary').should('be.visible');
      cy.contains('Total Concession').should('be.visible');
      cy.contains('$' + summary.totalRefund).should('be.visible');
      cy.contains('Refund To').should('be.visible');
      cy.contains(payDetails.cardHolderName).should('be.visible');
      cy.contains(payDetails.type + ' ending in ' + payDetails.accountNumber.slice(-4)).should(
        'be.visible',
      );
      cy.contains('Exp ' + payDetails.expirationMonth + '/' + payDetails.expirationYear).should(
        'be.visible',
      );
      cy.contains('Special Requests').should('be.visible');
      cy.contains('Delivery complaints and shipping instructions').should('be.visible');
    });
  });
});
