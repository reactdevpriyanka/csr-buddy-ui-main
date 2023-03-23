import dayjs from 'dayjs';
import SummaryPage from '../../../support/pageobjects/SummaryPage';
import ActivityPage from '../../../support/pageobjects/ActivityPage';
import GWF_Page from '../../../support/pageobjects/GWF_Page';

describe.skip('Verify the Replace & Refund Guided Workflow', () => {
  const activityPage = new ActivityPage();
  const gwfPage = new GWF_Page();
  const summaryPage = new SummaryPage();
  let customerId, email, orderId, itemName, itemQuantity, itemNumber;

  before(() => {
    cy.login();
    cy.fixture('workflows/gwf-stg-order.json').then((body) => {
      customerId = body.customerId;
      email = body.email;
      orderId = body.orderId;
      itemName = body.name;
      itemQuantity = body.quantity;
      itemNumber = body.partNumber;
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

  it('should display all three GWF options', () => {
    activityPage.getGwfPageForOrder(orderId);
    cy.contains('Fix an Issue: Order #' + orderId + '').should('be.visible');
    cy.contains('Replacement').should('be.visible');
    cy.contains('Refund').should('be.visible');
    cy.contains('Concession').should('be.visible');
  });

  it('should display items and Select All button when Replacement is selected', () => {
    gwfPage.getReplacementRadioBtn().click();
    gwfPage.getReplacementRadioBtn().should('be.checked');
    cy.contains('Choose Item(s)').should('be.visible');
    cy.contains('Available Quantity').should('be.visible');
    cy.contains('Product').should('be.visible');
    cy.contains('Reason').should('be.visible');
    cy.contains('Send Back').should('be.visible');
    gwfPage.getSelectAllButton().should('be.enabled');
    cy.contains('All products in this order').should('be.visible');
    gwfPage.getPrimaryReasonDropDown().eq(0).parent().should('have.class', 'Mui-disabled');
    gwfPage.getSendBackCheckBox().eq(0).should('be.disabled');
    cy.get('[data-testid="gwf:multi-item-quantity-minus"].disabled').should('be.visible');
    gwfPage.getItemQuantityPlusIcon().should('be.enabled');
    cy.contains('ITEM #' + itemNumber + '').should('be.visible');
    cy.contains(itemName).should('be.visible');
    cy.contains(itemName)
      .next()
      .invoke('text')
      .should('contain', 'Qty Ordered: ' + itemQuantity);
    gwfPage.getPrimaryReasonDropDown().eq(1).parent().should('not.have.class', 'Mui-disabled');
    gwfPage.getSendBackCheckBox().eq(1).should('be.enabled');
    cy.contains('Select a quantity to continue').should('be.visible');
  });

  it('should display appropriate fields when Select All is selected', () => {
    gwfPage.getSelectAllButton().click();
    gwfPage.getPrimaryReasonDropDown().eq(0).parent().should('not.have.class', 'Mui-disabled');
    gwfPage.getSendBackCheckBox().eq(0).should('be.enabled');
    gwfPage.getPrimaryReasonDropDown().eq(1).parent().should('have.class', 'Mui-disabled');
    gwfPage.getSendBackCheckBox().eq(1).should('be.disabled');
    cy.get('[data-testid="gwf:multi-item-quantity-minus"].disabled').should('be.visible');
    cy.get('[data-testid="gwf:multi-item-quantity-plus"].disabled').should('be.visible');
    cy.contains('Complete all return reasons to continue').should('be.visible');
    gwfPage.getViewSummaryButton().should('be.disabled');
  });

  it('should be able to select Return Reasons for all items', () => {
    gwfPage.getPrimaryReasonDropDown().eq(0).click();
    gwfPage.getReturnReason('Damaged').should('be.visible').click();
    gwfPage.getPrimaryReasonDropDown().eq(0).invoke('text').should('have.string', 'Damaged');
    gwfPage.getSecondaryReasonDropDown().should('be.visible').click();
    gwfPage.getReturnReason('Box And Product').should('be.visible').click();
    gwfPage.getSecondaryReasonDropDown().invoke('text').should('have.string', 'Box And Product');
    gwfPage.getTertiaryReasonDropDown().should('be.visible').click();
    gwfPage.getReturnReason('Dented Box Or Product').should('be.visible').click();
    gwfPage
      .getTertiaryReasonDropDown()
      .invoke('text')
      .should('have.string', 'Dented Box Or Product');
    gwfPage.getAdditionalCommentsTextBox().type('TEST COMMENT');
    gwfPage.getSendBackCheckBox().eq(0).check();
    gwfPage.getSendBackCheckBox().eq(0).should('be.checked');
    cy.contains('Select a quantity to continue').should('not.exist');
    cy.contains('Complete all return reasons to continue').should('not.exist');
    gwfPage.getViewSummaryButton().should('be.enabled');
  });

  it('should erase all prefilled return data when Unselect All is selected', () => {
    cy.contains('button', 'Unselect All').click();
    gwfPage.getPrimaryReasonDropDown().eq(0).invoke('text').should('have.string', '');
    gwfPage.getSecondaryReasonDropDown().should('not.exist');
    gwfPage.getTertiaryReasonDropDown().should('not.exist');
    gwfPage.getAdditionalCommentsTextBox().should('not.exist');
    gwfPage.getPrimaryReasonDropDown().eq(0).parent().should('have.class', 'Mui-disabled');
    gwfPage.getPrimaryReasonDropDown().eq(1).parent().should('not.have.class', 'Mui-disabled');
    gwfPage.getSendBackCheckBox().eq(0).should('be.disabled');
    gwfPage.getSendBackCheckBox().eq(0).should('not.be.checked');
    gwfPage.getSendBackCheckBox().eq(1).should('be.enabled');
    cy.contains('Select a quantity to continue').should('be.visible');
  });

  it('should be able to enter Return Reasons for Individual item', () => {
    gwfPage.getItemQuantityPlusIcon().click();
    cy.contains('Complete all return reasons to continue').should('be.visible');
    gwfPage.getPrimaryReasonDropDown().eq(1).click();
    gwfPage.getReturnReason('Damaged').should('be.visible').click();
    gwfPage.getPrimaryReasonDropDown().eq(1).invoke('text').should('have.string', 'Damaged');
    gwfPage.getSecondaryReasonDropDown().should('be.visible').click();
    gwfPage.getReturnReason('Box And Product').should('be.visible').click();
    gwfPage.getSecondaryReasonDropDown().invoke('text').should('have.string', 'Box And Product');
    gwfPage.getTertiaryReasonDropDown().should('be.visible').click();
    gwfPage.getReturnReason('Dented Box Or Product').should('be.visible').click();
    gwfPage
      .getTertiaryReasonDropDown()
      .invoke('text')
      .should('have.string', 'Dented Box Or Product');
    gwfPage.getAdditionalCommentsTextBox().type('TEST COMMENT');
    gwfPage.getSendBackCheckBox().eq(1).check();
    gwfPage.getSendBackCheckBox().eq(1).should('be.checked');
    cy.contains('Select a quantity to continue').should('not.exist');
    cy.contains('Complete all return reasons to continue').should('not.exist');
    gwfPage.getViewSummaryButton().should('be.enabled');
  });

  it('should not be able to proceed further when no quantity is selected', () => {
    gwfPage.getItemQuantityMinusIcon().click();
    cy.contains('Select a quantity to continue').should('be.visible');
    cy.contains('Complete all return reasons to continue').should('not.exist');
    gwfPage.getViewSummaryButton().should('be.disabled');
    gwfPage.getItemQuantityPlusIcon().click();
  });

  it('should erase all prefilled return data when Select All is clicked', () => {
    gwfPage.getSelectAllButton().click();
    gwfPage.getPrimaryReasonDropDown().eq(0).parent().should('not.have.class', 'Mui-disabled');
    gwfPage.getPrimaryReasonDropDown().eq(0).invoke('text').should('have.string', '');
    gwfPage.getPrimaryReasonDropDown().eq(1).parent().should('have.class', 'Mui-disabled');
    gwfPage.getPrimaryReasonDropDown().eq(1).invoke('text').should('have.string', '');
    gwfPage.getSecondaryReasonDropDown().should('not.exist');
    gwfPage.getTertiaryReasonDropDown().should('not.exist');
    gwfPage.getSendBackCheckBox().eq(0).should('be.enabled');
    gwfPage.getSendBackCheckBox().eq(0).should('not.be.checked');
    gwfPage.getSendBackCheckBox().eq(1).should('be.disabled');
    gwfPage.getSendBackCheckBox().eq(1).should('not.be.checked');
    cy.contains('Complete all return reasons to continue').should('be.visible');
  });

  it('should display appropriate data in Summary Page for Replacement without return', () => {
    cy.intercept({
      method: 'POST',
      url:
        'https://csrb-gateway.csbb.stg.chewy.com/api/v1/gwf/version/2/name/returns-continueToSummary',
    }).as('shippingDetails');
    gwfPage.getReplacementRadioBtn().click();
    cy.contains('div', 'Return Reason').click();
    gwfPage.getReturnReason('Unauthorized Purchase').should('be.visible').click();
    gwfPage.getAdditionalCommentsTextBox().clear().type('TEST COMMENT');
    gwfPage.getViewSummaryButton().click();
    let shippingDetails;
    cy.wait('@shippingDetails').should(({ request, response }) => {
      shippingDetails = response.body.context.summaryDetails.shippingAddress;
    });
    cy.get('#gwf-form').within((body) => {
      cy.contains('Review and Finalize').should('be.visible');
      cy.contains('Replacement Summary').should('be.visible');
      cy.contains('Replacement Sent To:').should('be.visible');
      cy.contains('address', shippingDetails.fullName).should('be.visible');
      cy.contains('address', shippingDetails.addressLine1).should('be.visible');
      cy.contains('address', shippingDetails.city).should('be.visible');
      cy.contains('address', shippingDetails.state).should('be.visible');
      cy.contains('address', shippingDetails.postcode).should('be.visible');
      cy.contains('address', shippingDetails.country).should('be.visible');
      cy.contains('Return Package Options').should('not.exist');
      cy.contains('Special Requests').should('be.visible');
      cy.contains('Delivery complaints and shipping instructions').should('be.visible');
    });
  });

  it('should display appropriate data in Summary Page for Replacement with return', () => {
    cy.intercept({
      method: 'POST',
      url:
        'https://csrb-gateway.csbb.stg.chewy.com/api/v1/gwf/version/2/name/returns-continueToSummary',
    }).as('shippingDetails');
    gwfPage.getQuestionsLink().click();
    cy.contains('span', 'Summary').should('be.visible');
    gwfPage.getSendBackCheckBox().eq(0).check();
    cy.contains('All products in this order').click();
    gwfPage.getAdditionalCommentsTextBox().clear().type('TEST RETURN COMMENT');
    gwfPage.getViewSummaryButton().click();
    let shippingDetails;
    cy.wait('@shippingDetails').should(({ request, response }) => {
      shippingDetails = response.body.context.summaryDetails.shippingAddress;
    });
    cy.get('#gwf-form').within((body) => {
      cy.contains('Review and Finalize').should('be.visible');
      cy.contains('Replacement Summary').should('be.visible');
      cy.contains('Replacement Sent To:').should('be.visible');
      cy.contains('address', shippingDetails.fullName).should('be.visible');
      cy.contains('address', shippingDetails.addressLine1).should('be.visible');
      cy.contains('address', shippingDetails.city).should('be.visible');
      cy.contains('address', shippingDetails.state).should('be.visible');
      cy.contains('address', shippingDetails.postcode).should('be.visible');
      cy.contains('address', shippingDetails.country).should('be.visible');
      cy.contains('Return Package Options').should('be.visible');
      cy.contains('Label(s) (email)').should('be.visible');
      cy.contains('Mailed shipping label(s) (snail mail)').should('be.visible');
      cy.contains('Send box(es) to customer').should('be.visible');
      cy.contains('FedEx Pickup').should('be.visible');
      cy.contains('Special Requests').should('be.visible');
      cy.contains('Delivery complaints and shipping instructions').should('be.visible');
    });
  });

  it('should display appropriate values in labels dropdown for email', () => {
    cy.contains('All labels will be instantly created and sent to (' + email + ')').should(
      'be.visible',
    );
    summaryPage.getEmailLabelDropdown().should('have.text', '1 Label');
    summaryPage.getEmailLabelDropdown().click();
    summaryPage.getLabelsList().find('li[role="option"]').should('have.length', 6);
    summaryPage.getLabelsList().contains('li', '2 Labels').click();
  });

  it('should display appropriate values when Mail Shipping is checked', () => {
    summaryPage.getSnailMailCheckBox().click();
    cy.contains('Mailed labels will be sent to customer via supply team').should('be.visible');
    cy.contains('Pickup unavailable with mailed shipping labels').should('be.visible');
    summaryPage.getSnailMailLabelsDropdown().should('have.text', '1 Label');
    summaryPage.getSnailMailLabelsDropdown().click();
    summaryPage.getLabelsList().find('li[role="option"]').should('have.length', 6);
    summaryPage.getLabelsList().contains('li', '3 Labels').click();
    summaryPage.getSnailMailAddressDropDown().should('be.visible');
    summaryPage.getSnailMailCheckBox().click();
    cy.contains('Mailed labels will be sent to customer via supply team').should('not.exist');
    cy.contains('Pickup unavailable with mailed shipping labels').should('not.exist');
    cy.get('input[name="summaryDetails.quantityOfMailLabels"]').should('not.exist');
    cy.get('input[name="summaryDetails.snailMailAddress"]').should('not.exist');
  });

  it('should display appropriate values when Send Box(es) is checked', () => {
    summaryPage.getSendBoxesCheckBox().click();
    summaryPage.getBoxCountDropDown().should('have.text', '1 Box');
    summaryPage.getBoxCountDropDown().click();
    summaryPage.getLabelsList().find('li[role="option"]').should('have.length', 6);
    summaryPage.getLabelsList().contains('li', '2 Boxes').click();
    summaryPage.getBoxesMailingAddressDropDown().should('be.visible');
    summaryPage.getSendBoxesCheckBox().click();
    cy.get('input[name="summaryDetails.quantityOfBoxes"]').should('not.exist');
    cy.get('input[name="summaryDetails.boxesMailingAddress"]').should('not.exist');
  });

  it('should be able to select custom FedEx pickUp Date', () => {
    summaryPage.getFedExPickupCheckBox().click();
    cy.contains('Mailed shipping label unavailable if pickup selected').should('be.visible');
    summaryPage.getFedExBoxCountDropDown().click();
    summaryPage.getFedExBoxCountDropDown().should('have.text', '1 Box');
    summaryPage.getLabelsList().find('li[role="option"]').should('have.length', 6);
    summaryPage.getLabelsList().contains('li', '2 Boxes').click();
    summaryPage.getFedExPickupDatePicker().should('be.visible');
    //summaryPage.getFedExPickupDatePicker().should('have.value',dayjs().add(1,'day').format('YYYY-MM-DD'));
    summaryPage.getFedExPickupDatePicker().click().type(dayjs().add(2, 'day').format('YYYY-MM-DD'));
    summaryPage.getFedexMailingAddressDropDown().should('be.visible');
    summaryPage.getFedExPickupCheckBox().click();
    cy.get('input[name="summaryDetails.quantityOfFedexBoxes"]').should('not.exist');
    summaryPage.getFedExPickupDatePicker().should('not.exist');
    cy.get('input[name="summaryDetails.fedexMailingAddress"]').should('not.exist');
  });

  it('should be able to verify the Special Requests', () => {
    summaryPage.getSpecialRequests().click();
    summaryPage.getComplaintNoneRadioButton().should('be.checked');
    summaryPage.getInstructionNoneRadioButton().should('be.checked');
    cy.contains('Delivery Complaint').should('be.visible');
    cy.contains('Order damaged/open upon delivery').should('be.visible');
    cy.contains('Package left in rain without a cover').should('be.visible');
    cy.contains('Witnessed driver mishandling package').should('be.visible');
    cy.contains('Bring to front door').should('be.visible');
    cy.contains('Bring to back door').should('be.visible');
    cy.contains('Bring order to Apt door').should('be.visible');
  });

  it('Verify the request when only labels is selected in summary page', () => {
    cy.intercept('/api/v1/gwf/version/2/name/returns-submit', (req) => {
      expect(req.body.summaryDetails.returnLabelChecked).to.eq(true);
      expect(req.body.summaryDetails.snailMailLabels).to.eq(false);
      expect(req.body.summaryDetails.fedexPickup).to.eq(false);
      expect(req.body.summaryDetails.sendBoxes).to.eq(false);
      expect(req.body.summaryDetails.quantityOfBoxesChecked).to.eq(false);
      expect(req.body.summaryDetails.quantityOfMailLabels).to.eq('1');
      expect(req.body.summaryDetails.quantityOfBoxes).to.eq('1');
      expect(req.body.summaryDetails.quantityOfFedexBoxes).to.eq('1');
      expect(req.body.summaryDetails.quantityOfEmailLabels).to.eq('1');
      expect(req.body.summaryDetails.specialRequests1.deliveryComplaint).to.eq('None');
      expect(req.body.summaryDetails.specialRequests1.shippingInstructions).to.eq('None');
      req.reply({
        statusCode: 201,
        body: {},
      });
    }).as('returnsSubmit');
    summaryPage.getSubmitButton().click();
    cy.wait('@returnsSubmit');
  });

  it('Verify the request when snail mail is selected with complaint in summary page', () => {
    cy.login();
    cy.visit(
      '/app/customers/' + customerId + '/activity?agentProfile=DEV%20-%20CSRBuddy%20-%20Admin',
    );
    activityPage.getGwfPageForOrder(orderId);
    gwfPage.replaceAllItems();
    cy.intercept('/api/v1/gwf/version/2/name/returns-submit', (req) => {
      expect(req.body.summaryDetails.returnLabelChecked).to.eq(true);
      expect(req.body.summaryDetails.snailMailLabels).to.eq(true);
      expect(req.body.summaryDetails.fedexPickup).to.eq(false);
      expect(req.body.summaryDetails.sendBoxes).to.eq(false);
      expect(req.body.summaryDetails.quantityOfBoxesChecked).to.eq(true);
      expect(req.body.summaryDetails.quantityOfMailLabels).to.eq('3');
      expect(req.body.summaryDetails.quantityOfBoxes).to.eq('4');
      expect(req.body.summaryDetails.quantityOfFedexBoxes).to.eq('1');
      expect(req.body.summaryDetails.quantityOfEmailLabels).to.eq('1');
      req.reply({
        statusCode: 201,
        body: {},
      });
    }).as('snailMailSubmit');
    summaryPage.getEmailLabelDropdown().click();
    summaryPage.getLabelsList().contains('li', '2 Labels').click();
    summaryPage.getSnailMailCheckBox().click();
    summaryPage.getSnailMailLabelsDropdown().click();
    summaryPage.getLabelsList().contains('li', '3 Labels').click();
    summaryPage.getSendBoxesCheckBox().click();
    summaryPage.getBoxCountDropDown().click();
    summaryPage.getLabelsList().contains('li', '4 Boxes').click();
    summaryPage.getSpecialRequests().click();
    summaryPage.getDamagedComplaint().click();
    summaryPage.getComplaintTextBox().type('Test Complaint');
    summaryPage.getFrontDoorInstruction().click();
    summaryPage.getInstructionsTextBox().type('Test Instruction');
    summaryPage.getSubmitButton().click();
    cy.wait('@snailMailSubmit');
  });

  it('Verify the request when FedEx Pickup is selected with complaint in summary page', () => {
    cy.login();
    cy.visit(
      '/app/customers/' + customerId + '/activity?agentProfile=DEV%20-%20CSRBuddy%20-%20Admin',
    );
    activityPage.getGwfPageForOrder(orderId);
    gwfPage.replaceAllItems();
    cy.intercept('/api/v1/gwf/version/2/name/returns-submit', (req) => {
      expect(req.body.summaryDetails.returnLabelChecked).to.eq(true);
      expect(req.body.summaryDetails.snailMailLabels).to.eq(false);
      expect(req.body.summaryDetails.fedexPickup).to.eq(true);
      expect(req.body.summaryDetails.sendBoxes).to.eq(false);
      expect(req.body.summaryDetails.quantityOfBoxesChecked).to.eq(true);
      expect(req.body.summaryDetails.quantityOfMailLabels).to.eq('1');
      expect(req.body.summaryDetails.quantityOfBoxes).to.eq('4');
      expect(req.body.summaryDetails.quantityOfFedexBoxes).to.eq('2');
      expect(req.body.summaryDetails.quantityOfEmailLabels).to.eq('1');
      req.reply({
        statusCode: 201,
        body: {},
      });
    }).as('fedExSubmit');
    summaryPage.getSendBoxesCheckBox().click();
    summaryPage.getBoxCountDropDown().click();
    summaryPage.getLabelsList().contains('li', '4 Boxes').click();
    summaryPage.getFedExPickupCheckBox().click();
    summaryPage.getFedExBoxCountDropDown().click();
    summaryPage.getLabelsList().contains('li', '2 Boxes').click();
    summaryPage.getFedExPickupDatePicker().click().type(dayjs().add(2, 'day').format('YYYY-MM-DD'));
    summaryPage.getSpecialRequests().click();
    summaryPage.getDamagedComplaint().click();
    summaryPage.getComplaintTextBox().type('Test Complaint');
    summaryPage.getFrontDoorInstruction().click();
    summaryPage.getInstructionsTextBox().type('Test Instruction');
    summaryPage.getSubmitButton().click();
    cy.wait('@fedExSubmit');
  });
});
