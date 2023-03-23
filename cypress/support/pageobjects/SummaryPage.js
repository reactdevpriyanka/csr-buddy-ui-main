export default class SummaryPage{

    getSummaryLink(){
        return cy.contains('a','Summary');
    }

    getEmailLabelCheckBox(){
      return cy.contains('span','Label(s) (email)').parent().find('input[type="checkbox"]');
    }

    getEmailLabelDropdown(){
        return cy.get('div[id="select-label-id"]');
    }

    getLabelsList(){
        return cy.get('ul[role="listbox"]');
    }

    getSnailMailCheckBox(){
        return cy.get('input[name="summaryDetails.snailMailLabels"][type="checkbox"]');
    }

    getSnailMailLabelsDropdown(){
        return cy.get('input[name="summaryDetails.quantityOfMailLabels"]').parent().find('div[id="select-label-id"]');
    }

    getSnailMailAddressDropDown(){
        return cy.get('input[name="summaryDetails.snailMailAddress"]').parent().find('div[id="select-label-id"]');
    }

    getSendBoxesCheckBox(){
        return cy.get('input[name="summaryDetails.quantityOfBoxesChecked"][type="checkbox"]');
    }

    getBoxCountDropDown(){
        return cy.get('input[name="summaryDetails.quantityOfBoxes"]').parent().find('div[id="select-label-id"]');
    }

    getBoxesMailingAddressDropDown(){
        return cy.get('input[name="summaryDetails.boxesMailingAddress"]').parent().find('div[id="select-label-id"]');
    }
    
    getFedExPickupCheckBox(){
        return cy.get('input[name="summaryDetails.fedexPickup"][type="checkbox"]');
    }

    getFedExBoxCountDropDown(){
        return cy.get('input[name="summaryDetails.quantityOfFedexBoxes"]').parent().find('div[id="select-label-id"]');
    }

    getFedExPickupDatePicker(){
        return cy.get('input[name="summaryDetails.returnFedexPickupDate"]');
    }

    getFedexMailingAddressDropDown(){
        return cy.get('input[name="summaryDetails.fedexMailingAddress"]').parent().find('div[id="select-label-id"]');
    }

    getSubmitButton(){
        return cy.contains('button','Submit');
    }

    getSpecialRequests(){
        return cy.get('[data-testid = "gwf-node:expandablelabel:hide-button"]');
    }

    getDamagedComplaint(){
        return cy.get('[data-testid = "gwf-input:radio:input-Damaged"]');
    }

    getLeftInRainComplaint(){
        return cy.get('[data-testid = "gwf-input:radio:input-LeftInRain"]');
    }

    getDriverMishandledComplaint(){
        return cy.get('[data-testid = "gwf-input:radio:input-DriverMishandledPackage"]');
    }

    getComplaintTextBox(){
        return cy.get('input[name="summaryDetails.specialRequests1.deliveryComplaintText"]');
    }

    getComplaintNoneRadioButton(){
        return cy.get('input[name = "summaryDetails.specialRequests1.deliveryComplaint"]');
    }

    getFrontDoorInstruction(){
        return cy.get('[data-testid = "gwf-input:radio:input-FrontDoor"]');
    }

    getBackDoorInstruction(){
        return cy.get('[data-testid = "gwf-input:radio:input-BackDoor"]');
    }

    getAptDoorInstruction(){
        return cy.get('[data-testid = "gwf-input:radio:input-AptDoor"]');
    }

    getInstructionsTextBox(){
        return cy.get('input[name="summaryDetails.specialRequests1.shippingInstructionsText"]');
    }

    getInstructionNoneRadioButton(){
        return cy.get('input[name = "summaryDetails.specialRequests1.shippingInstructions"]');
    }
}
