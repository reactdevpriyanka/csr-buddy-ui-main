export default class GWF_Page{

    getReplacementRadioBtn(){
        return cy.get('[type="radio"][value="REPLACEMENT"]',{timeout: 20000});
    }

    getRefundRadioBtn(){
        return cy.get('[type="radio"][value="REFUND"]',{timeout: 20000});
    }

    getConcessionRadioBtn(){
        return cy.get('[type="radio"][value="CONCESSION"]',{timeout: 20000});
    }

    getSelectAllButton(){
      return cy.contains('button','Select All');
    }

    getSelectAllCheckBox(){
        return cy.get('[data-indeterminate="false"][type="checkbox"]').eq(0);
    }

    getProductCheckBox(){
        return cy.get('[data-indeterminate="false"][type="checkbox"]').eq(1);
    }

    getShippingCheckBox(){
        return cy.get('[data-indeterminate="false"][type="checkbox"]').eq(2);
    }

    getItemQuantityPlusIcon(){
        return cy.get('[data-testid="gwf:multi-item-quantity-plus"]');
    }

    getItemQuantityMinusIcon(){
        return cy.get('[data-testid="gwf:multi-item-quantity-minus"]');
    }

    getPrimaryReasonDropDown(){
        return cy.get('div[id="multi-item-select-primary"]');
    }

    getSecondaryReasonDropDown(){
        return cy.get('#multi-item-select-secondary');
    }

    getTertiaryReasonDropDown(){
        return cy.get('#multi-item-select-tertiary');
    }

    getAdditionalCommentsTextBox(){
        return cy.get('textarea[aria-invalid="false"]');
    }

    getReturnReason(reason){
        return cy.contains(reason);
    }

    getSendBackCheckBox(){
        return cy.get('[type="checkbox"].PrivateSwitchBase-input');
    }

    getShelterDonationCheckBox(){
        return cy.get('[type="checkbox"].PrivateSwitchBase-input');
    }

    getProductConcessionDetails(){
        return cy.contains('div', 'Unit $').parent().parent();
    }

    getShippingConcessionDetails(){
        return cy.contains('div', 'Flat rate').parent().parent();
    }

    getConcessionAmountTextBox(){
        return cy.get('input[type="text"]');
    }

    getHomeLink(){
        return cy.contains('a','Home');
    }

    getQuestionsLink(){
        return cy.contains('a','Questions');
    }

    getCancelButton(){
        return cy.contains('button','Cancel');
    }

    getViewSummaryButton(){
        return cy.contains('button','View Summary');
    }

    replaceAllItems(){
        this.getReplacementRadioBtn().click();
        this.getSelectAllButton().click();
        this.getPrimaryReasonDropDown().eq(0).click();
        this.getReturnReason('Unauthorized Purchase').should('be.visible').click();
        this.getPrimaryReasonDropDown().eq(0).invoke('text').should('have.string','Unauthorized Purchase');
        this.getAdditionalCommentsTextBox().type("TEST COMMENT");
        this.getSendBackCheckBox().eq(0).check();
        this.getViewSummaryButton().click();
    }

    refundAllItems(){
        this.getRefundRadioBtn().click();
        this.getSelectAllButton().click();
        this.getPrimaryReasonDropDown().eq(0).click();
        this.getReturnReason('Damaged').should('be.visible').click();
        this.getPrimaryReasonDropDown().eq(0).invoke('text').should('have.string','Damaged');
        this.getSecondaryReasonDropDown().should('be.visible').click();
        this.getReturnReason('Box And Product').should('be.visible').click();
        this.getSecondaryReasonDropDown().invoke('text').should('have.string','Box And Product');
        this.getTertiaryReasonDropDown().should('be.visible').click();
        this.getReturnReason('Dented Box Or Product').should('be.visible').click();
        this.getAdditionalCommentsTextBox().type("TEST COMMENT");
        this.getSendBackCheckBox().eq(0).check();
        this.getViewSummaryButton().click();
    }
}
