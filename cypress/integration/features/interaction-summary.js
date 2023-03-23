import petProfileInteractionData from '../../fixtures/interactions/pet-profile-interaction';
import customerProfileInteractionData from '../../fixtures/interactions/customer-profile-interaction';
import autoshipInteractionData from '../../fixtures/interactions/autoship-interaction';
import orderInteractionData from '../../fixtures/interactions/order-interaction';

describe.skip('it should display the agent pet profile interaction summary', () => {
    beforeEach(() => {
        cy.login();
        cy.intercept('GET', '/api/v1/interactions?customerId*', {
            fixture: 'interactions/pet-profile-interaction'
        }).as('interaction');
        cy.visitActivityFeed();
        cy.wait('@interaction');
    });

    it('should display pet-profile interaction', () => {
        validatePetProfileData(petProfileInteractionData[0]);
    });

    it('should display pet-profile interaction history', () => {
        cy.getByTestId(`interaction-history-icon`).click();
        validatePetProfileData(petProfileInteractionData[1]);
    });

    const validatePetProfileData = ({
      incidentId,
      appeasements: [
          addedPet,
          updatedPet,
          deactivatedPet,
          activatedPet,
          taggedPet,
          unTaggedPet
      ]
    }) => {
        // validate added pet
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-header`).contains("Modified Pet Profile").should('exist');
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-0-label`).contains("Pet name:").should('exist');
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-0-value`)
            .contains(addedPet.details.currentVal.name, {matchCase: false});
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-1-value`).contains("Added pet").should('exist');
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-2-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${addedPet.appeasementId}-2-value`).contains("Removed tag").should('exist');

        // validate updated pet
        cy.getByTestId(`${incidentId}-${updatedPet.appeasementId}-header`).contains("Modified Pet Profile").should('exist');
        cy.getByTestId(`${incidentId}-${updatedPet.appeasementId}-0-label`).contains("Pet name:").should('exist');
        cy.getByTestId(`${incidentId}-${updatedPet.appeasementId}-0-value`)
            .contains(updatedPet.details.currentVal.name, {matchCase: false});
        cy.getByTestId(`${incidentId}-${updatedPet.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${updatedPet.appeasementId}-1-value`).contains("Updated pet info").should('exist');

        // validate deactivate pet
        cy.getByTestId(`${incidentId}-${deactivatedPet.appeasementId}-header`).contains("Modified Pet Profile").should('exist');
        cy.getByTestId(`${incidentId}-${deactivatedPet.appeasementId}-0-label`).contains("Pet name:").should('exist');
        cy.getByTestId(`${incidentId}-${deactivatedPet.appeasementId}-0-value`)
            .contains(deactivatedPet.details.currentVal.name, {matchCase: false});
        cy.getByTestId(`${incidentId}-${deactivatedPet.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${deactivatedPet.appeasementId}-1-value`).contains("Deactivated pet").should('exist');

        // validate activate pet
        cy.getByTestId(`${incidentId}-${activatedPet.appeasementId}-header`).contains("Modified Pet Profile").should('exist');
        cy.getByTestId(`${incidentId}-${activatedPet.appeasementId}-0-label`).contains("Pet name:").should('exist');
        cy.getByTestId(`${incidentId}-${activatedPet.appeasementId}-0-value`)
            .contains(activatedPet.details.currentVal.name, {matchCase: false});
        cy.getByTestId(`${incidentId}-${activatedPet.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${activatedPet.appeasementId}-1-value`).contains("Activated pet").should('exist');

        // validate add tags to pet
        cy.getByTestId(`${incidentId}-${taggedPet.appeasementId}-header`).contains("Modified Pet Profile").should('exist');
        cy.getByTestId(`${incidentId}-${taggedPet.appeasementId}-0-label`).contains("Pet name:").should('exist');
        cy.getByTestId(`${incidentId}-${taggedPet.appeasementId}-0-value`)
            .contains(taggedPet.details.currentVal.name, {matchCase: false});
        cy.getByTestId(`${incidentId}-${taggedPet.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${taggedPet.appeasementId}-1-value`).contains("Add tag").should('exist');

        // validate remove tags from pet
        cy.getByTestId(`${incidentId}-${unTaggedPet.appeasementId}-header`).contains("Modified Pet Profile").should('exist');
        cy.getByTestId(`${incidentId}-${unTaggedPet.appeasementId}-0-label`).contains("Pet name:").should('exist');
        cy.getByTestId(`${incidentId}-${unTaggedPet.appeasementId}-0-value`)
            .contains(unTaggedPet.details.currentVal.name, {matchCase: false});
        cy.getByTestId(`${incidentId}-${unTaggedPet.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${unTaggedPet.appeasementId}-1-value`).contains("Removed tag").should('exist');
    }
});

describe.skip('it should display the agent customer profile interaction summary', () => {
    beforeEach(() => {
        cy.login();
        cy.intercept('GET', '/api/v1/interactions?customerId*', {
            fixture: 'interactions/customer-profile-interaction'
        }).as('interaction');
        cy.visitActivityFeed();
        cy.wait('@interaction');
    });

    it('should display customer-profile interaction', () => {
        validateCustomerAccountData(customerProfileInteractionData[0]);
    });

    it('should display customer-profile interaction history', () => {
        cy.getByTestId(`interaction-history-icon`).click();
        validateCustomerAccountData(customerProfileInteractionData[1]);
    });

    const validateCustomerAccountData = ({
        incidentId,
        appeasements: [
            customerProfile,
            customerTagsAdded,
            customerTagsRemoved,
            resetPassword,
            noUpdateAppeasement
        ]
    }) => {
        cy.getByTestId(`${incidentId}-${customerProfile.appeasementId}-header`).contains("Modified Customer Account").should('exist');
        cy.getByTestId(`${incidentId}-${customerProfile.appeasementId}-0-label`).contains("Updated Email").should('exist');
        cy.getByTestId(`${incidentId}-${customerProfile.appeasementId}-1-label`).contains("Updated Name").should('exist');
        cy.getByTestId(`${incidentId}-${customerProfile.appeasementId}-2-label`).contains("Updated Account Status").should('exist');
        cy.getByTestId(`${incidentId}-${customerProfile.appeasementId}-3-label`).contains("Updated Phone Number").should('exist');
        cy.getByTestId(`${incidentId}-${customerTagsAdded.appeasementId}-4-label`).contains("Added Tag").should('exist');
        cy.getByTestId(`${incidentId}-${customerTagsRemoved.appeasementId}-5-label`).contains("Removed Tag").should('exist');
        cy.getByTestId(`${incidentId}-${resetPassword.appeasementId}-6-label`).contains("Reset Password").should('exist');
        cy.getByTestId(`${incidentId}-SWITCH_TO_USER-header`).contains("Switched to Storefront").should('exist');

        const tempTestId = `${incidentId}-${noUpdateAppeasement.appeasementId}-header`;
        cy.get(`[data-testid="${tempTestId}"]`).should('not.exist');
    }
});

describe.skip('it should display the agent autoship interaction summary', () => {
    beforeEach(() => {
        cy.login();
        cy.intercept('GET', '/api/v1/interactions?customerId*', {
            fixture: 'interactions/autoship-interaction'
        }).as('interaction');
        cy.visitActivityFeed();
        cy.wait('@interaction');
    });

    it('should display autoship interaction', () => {
        validateAutoshipData(autoshipInteractionData[0]);
    });

    it('should display autoship interaction history', () => {
        cy.getByTestId(`interaction-history-icon`).click();
        validateAutoshipData(autoshipInteractionData[1]);
    });

    const validateAutoshipData = ({
        incidentId,
        appeasements: [
            rescheduled,
            triggered,
            skipped,
            frequency,
            cancelled,
            resendEmail,
            sameAutoshipResendEmail,
        ]
    }) => {
        cy.getByTestId(`${incidentId}-${rescheduled.appeasementId}-header`).contains("Modified Autoship").should('exist');

        cy.getByTestId(`${incidentId}-${rescheduled.appeasementId}-0-label`).contains("Autoship Name:").should('exist');
        cy.getByTestId(`${incidentId}-${rescheduled.appeasementId}-0-value`).contains(rescheduled.details.currentVal.name, {matchCase: false}).should('exist');
        cy.getByTestId(`${incidentId}-${rescheduled.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${rescheduled.appeasementId}-1-value`).contains("Rescheduled").should('exist');
        cy.getByTestId(`${incidentId}-${sameAutoshipResendEmail.appeasementId}-2-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${sameAutoshipResendEmail.appeasementId}-2-value`).contains("Resent Autoship Email").should('exist');

        cy.getByTestId(`${incidentId}-${triggered.appeasementId}-0-value`).contains(triggered.details.currentVal.name, {matchCase: false}).should('exist');
        cy.getByTestId(`${incidentId}-${triggered.appeasementId}-1-value`).contains("Triggered Autoship").should('exist');

        cy.getByTestId(`${incidentId}-${skipped.appeasementId}-0-value`).contains(skipped.details.currentVal.name, {matchCase: false}).should('exist');
        cy.getByTestId(`${incidentId}-${skipped.appeasementId}-1-value`).contains("Skipped Next Shipment").should('exist');

        cy.getByTestId(`${incidentId}-${frequency.appeasementId}-0-value`).contains(frequency.details.currentVal.name, {matchCase: false}).should('exist');
        cy.getByTestId(`${incidentId}-${frequency.appeasementId}-1-value`).contains("Updated Frequency").should('exist');

        cy.getByTestId(`${incidentId}-${cancelled.appeasementId}-0-value`).contains(cancelled.details.currentVal.name, {matchCase: false}).should('exist');
        cy.getByTestId(`${incidentId}-${cancelled.appeasementId}-1-value`).contains("Cancelled Autoship").should('exist');

        cy.getByTestId(`${incidentId}-${resendEmail.appeasementId}-0-value`).contains(cancelled.details.currentVal.name, {matchCase: false}).should('exist');
        cy.getByTestId(`${incidentId}-${resendEmail.appeasementId}-1-value`).contains("Resent Autoship Email").should('exist');
    }
});


describe.skip('it should display the agent order interaction summary', () => {
    beforeEach(() => {
        cy.login();
        cy.intercept('GET', '/api/v1/interactions?customerId*', {
            fixture: 'interactions/order-interaction'
        }).as('interaction');
        cy.visitActivityFeed();
        cy.wait('@interaction');
    });

    it('should display order interaction', () => {
        validateOrderData(orderInteractionData[0]);
    });

    it('should display order interaction history', () => {
        cy.getByTestId(`interaction-history-icon`).click();
        validateOrderData(orderInteractionData[1]);
    });

    const validateOrderData = ({
        incidentId,
        appeasements: [
            cancelled,
            sentOrderConfirmation,
            sentInvoice,
            trackedPackage,
            removedItem,
            reducedQty,
            sameAppeasementReducedQty,
            adjustedPrice,
            addedPrice,
            updatedShipAddress,
            returnOrder1,
            returnOrder2,
            cancelledReturn,
            createdLabel,
            cancelledRelease,
            markedAsReceived,
        ]
    }) => {
        cy.getByTestId(`${incidentId}-${cancelled.appeasementId}-header`).contains("Modified Order").should('exist');

        cy.getByTestId(`${incidentId}-${cancelled.appeasementId}-0-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${cancelled.appeasementId}-0-value`).contains("Cancelled Order").should('exist');
        cy.getByTestId(`${incidentId}-${sameAppeasementReducedQty.appeasementId}-1-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${sameAppeasementReducedQty.appeasementId}-1-value`).contains("Reduced Quantity").should('exist');

        cy.getByTestId(`${incidentId}-${sentOrderConfirmation.appeasementId}-0-value`).contains("Sent Order Confirm Email").should('exist');
        cy.getByTestId(`${incidentId}-${sentInvoice.appeasementId}-0-value`).contains("Sent Invoice Email").should('exist');
        cy.getByTestId(`${incidentId}-${trackedPackage.appeasementId}-0-value`).contains("Tracked Package").should('exist');
        cy.getByTestId(`${incidentId}-${removedItem.appeasementId}-0-value`).contains("Removed Item").should('exist');
        cy.getByTestId(`${incidentId}-${reducedQty.appeasementId}-0-value`).contains("Reduced Quantity").should('exist');
        cy.getByTestId(`${incidentId}-${adjustedPrice.appeasementId}-1-value`).contains("Adjusted Price").should('exist');
        cy.getByTestId(`${incidentId}-${addedPrice.appeasementId}-2-value`).contains("Added Promotion").should('exist');
        cy.getByTestId(`${incidentId}-${updatedShipAddress.appeasementId}-3-value`).contains("Updated Shipping Address").should('exist');

        cy.getByTestId(`${incidentId}-${returnOrder1.appeasementId}-RETURNS-header`).contains("Return on Order").should('exist');
        cy.getByTestId(`${incidentId}-${returnOrder1.appeasementId}-RETURNS-0-label`).contains("Refund(Pending):").should('exist');
        cy.getByTestId(`${incidentId}-${returnOrder1.appeasementId}-RETURNS-0-value`).contains("Item 174681 Frisco Plush Squeaking Sloth Dog Toy, Medium").should('exist');

        cy.getByTestId(`${incidentId}-${returnOrder1.appeasementId}-RETURNS-1-label`).contains("Reason:").should('exist');
        cy.getByTestId(`${incidentId}-${returnOrder1.appeasementId}-RETURNS-1-value`).contains("Non Specific Damage - frisco plush toy, damaged, box & product, no s pecific damage.").should('exist');

        cy.getByTestId(`${incidentId}-${returnOrder2.appeasementId}-RETURNS-2-label`).contains("Refund(Pending):").should('exist');
        cy.getByTestId(`${incidentId}-${returnOrder2.appeasementId}-RETURNS-2-value`).contains("Item 161280 Frisco Moppy Ball Cat Toy, Blue").should('exist');

        cy.getByTestId(`${incidentId}-${returnOrder2.appeasementId}-RETURNS-3-label`).contains("Reason:").should('exist');
        cy.getByTestId(`${incidentId}-${returnOrder2.appeasementId}-RETURNS-3-value`).contains("Made Pet Sick - frisco Moppy Ball, does not want, made pet sick.").should('exist');

        cy.getByTestId(`${incidentId}-${markedAsReceived.appeasementId}-RETURNS-4-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${markedAsReceived.appeasementId}-RETURNS-4-value`).contains("Marked as Received").should('exist');

        cy.getByTestId(`${incidentId}-${cancelledReturn.appeasementId}-RETURNS-header`).contains("Return on Order").should('exist');
        cy.getByTestId(`${incidentId}-${cancelledReturn.appeasementId}-RETURNS-0-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${cancelledReturn.appeasementId}-RETURNS-0-value`).contains("Cancelled Return").should('exist');

        cy.getByTestId(`${incidentId}-${createdLabel.appeasementId}-RETURNS-header`).contains("Return on Order").should('exist');
        cy.getByTestId(`${incidentId}-${createdLabel.appeasementId}-RETURNS-0-label`).contains("Action:").should('exist');
        cy.getByTestId(`${incidentId}-${createdLabel.appeasementId}-RETURNS-0-value`).contains("Created New Labels").should('exist');

        cy.getByTestId(`${incidentId}-${cancelledRelease.appeasementId}-1-value`).contains("Cancelled Release").should('exist');
    }
});
