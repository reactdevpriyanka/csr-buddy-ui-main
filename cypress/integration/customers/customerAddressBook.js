import customerData from '../../fixtures/customers/customer+addresses';

describe('customer address book', () => {

  const addresses = [...customerData.addresses, ...customerData.customerAddresses];

  const interceptTags = () => {
    const cid = Cypress.env('TEST_CUSTOMER_ID');
    const url = `/api/v1/customer/${cid}`;
    cy.intercept(url, customerData).as('activeCustomer');
  };

  const visitAndFetch = () => {
    interceptTags();
    cy.visitActivityFeed();
    return cy.wait(`@activeCustomer`);
  };


  before(() => {
    cy.login();
    visitAndFetch();
  });


  describe('when address book is present', () => {

    beforeEach(() => {
     cy.login();
      visitAndFetch();
    });

    it('should render address book icon', () => {
      cy.getByTestId('customer-addressbook-icon').should('exist').and('be.visible');

    });

    it('should render address book dialog when address book icon is clicked', () => {
      cy.getByTestId('customer-addressbook-icon').click();
      cy.getByTestId('customer-addressbook-dialog').should('exist').and('be.visible');
    });

    it('should render address book dialog with appropriate header info', () => {
      cy.getByTestId('customer-addressbook-icon').click();
      cy.getByTestId('customer-addressbook-dialog').should('exist').and('be.visible');
      cy.getByTestId('customer-addressbook-title').contains('Address Book').should('be.visible');
      cy.getByTestId('customer-addressbook-user').contains('gaurav g').should('be.visible');
    });

    it('should render address book dialog with appropriate table info', () => {
      cy.getByTestId('customer-addressbook-icon').click();
      cy.getByTestId('customer-addressbook-dialog').should('exist').and('be.visible');


      for (const address of addresses) {

        cy.getByTestId(`address-${address.id}`).should('exist').and('be.visible').within(() => {
          if(address.primaryAddress){
            cy.get(`[data-testid="address-legend-${address.id}"]`).should('exist').and('be.visible');
          } else {
            cy.get(`[data-testid="address-legend-${address.id}"]`).should('not.exist');
          }
          cy.getByTestId(`address-fullName-${address.id}`).should('exist');
          cy.getByTestId(`address-timeCreated-${address.id}`).should('exist');
          cy.getByTestId(`address-verified-${address.id}`).should('exist');
          cy.getByTestId(`address-full-address-${address.id}`).should('exist');
          cy.getByTestId(`address-country-${address.id}`).should('exist');
          cy.getByTestId(`address-phone-${address.id}`).should('exist');
          cy.getByTestId(`address-email1-${address.id}`).should('exist');
        });
      }
    });

  });
});