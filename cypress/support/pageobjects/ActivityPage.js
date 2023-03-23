/* eslint-disable cypress/no-unnecessary-waiting */
export default class ActivityPage{

    getActivityHeader(orderId){
      return cy.get('#OrderCard_'+orderId+'',{ timeout: 90000 });
    }

    getOrderDetailsPage(orderId){
      cy.get('[data-testid="ordercard:id:viewdetails:link:'+orderId+'"]',{ timeout: 90000 }).click();
      return this;
    }

    getPackageDetailsPopup(){
      cy.get('[data-testid="actionButton-resolve"]',{ timeout: 30000 }).click();
    }

    getManageOrderButton(element,orderId){
      return cy.wrap(element).find("button[data-testid='order-actions-button:"+orderId+"']",{ timeout: 90000 });
    }

    getReturnItemsButton(){
      return cy.contains("Return Items",{ timeout: 90000 });
    }
    
    getGwfPageForOrder(orderId){
      this.getActivityHeader(orderId).then((el) => {
        this.getManageOrderButton(el,orderId).click();
        this.getReturnItemsButton().should('be.visible').click();
                });
    }

    getContentIcon(){
      return cy.get('[data-testid="card:body"]', { timeout: 60000 })
      .first()
      .find('[data-testid="ContentPasteIcon"]');
    }

    getContentpopup(){
      return cy.get('div[role="tooltip"]');
    }
}