import customer from '../../fixtures/customers/customer';
import tags from '../../fixtures/customers/customer+tags';
import services from '../../fixtures/customers/services';
import noServices from '../../fixtures/customers/services_none';

const { id, email, pets, addresses } = customer;
const [pet] = pets;
const [address] = addresses;

describe('<CustomerSidebar />', () => {
  const customerId = Cypress.env('TEST_CUSTOMER_ID');

  before(() => {
    cy.login();
    cy.intercept('GET', `/api/v1/customer/${customerId}`, customer).as('customer');
    cy.intercept('GET', `/api/v1/customer/${customerId}/services`, services).as('services');
    cy.intercept('GET', `/api/v1/customer/${customerId}/tags?appliedTagsOnly=true`, tags).as(
      'tags',
    );
    cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', `/api/v3/autoship-activities/**`, {
      fixture: `/activities/order`,
    }).as('orders');
    cy.visitActivityFeed();
    cy.wait(['@customer', '@tags', '@services', '@activities']);
  });

  const customerSidebarShouldBeVisible = () => {
    cy.getByTestId('customer-sidebar')
      .should('exist')
      .and('be.visible')
      .within(() => {
        cy.contains(id).should('be.visible');
        cy.contains(email).should('be.visible');
      });
  };

  it('should be visible by default', () => {
    customerSidebarShouldBeVisible();
  });

  it('should toggle visibility when toggle button is clicked', () => {
    cy.getByTestId('toggle-sidebar-button').click({ force: true }); // collapse
    cy.contains(id).should('not.be.visible');
    cy.contains(email).should('not.be.visible');

    cy.getByTestId('toggle-sidebar-button').click(); // expand
    customerSidebarShouldBeVisible();
  });

  it("should render the customer's ID", () => {
    cy.getByTestId('customer:cid:value').contains(id);
  });

  it("should render the customer's phone number", () => {
    if (address.phone?.length === 10) {
      cy.getByTestId('customer:phoneNumber:value').contains(
        address.phone.replace(/^(\d{3})(\d{3})(\d{4})$/g, '($1)$2-$3'),
      );
    } else {
      cy.getByTestId('customer:phoneNumber:value').contains(address.phone);
    }
  });

  it("should render the customer's email", () => {
    cy.getByTestId('customer:email:value').contains(email);
  });

  it("should render the customer's address", () => {
    cy.getByTestId('customer:location:value').contains(`${address.city}, ${address.state}`);
  });

  it("should render the customer's pets", () => {
    cy.contains(pet.name).should('exist');
    cy.contains(pet.breed).should('exist');
  });

  describe('with no subscriptions', () => {
    before(() => {
      cy.intercept('GET', `/api/v1/customer/${customerId}`, customer).as('customer').as('customer');
      cy.intercept('GET', `/api/v1/customer/${customerId}/tags?appliedTagsOnly=true`, tags).as(
        'tags',
      );
      cy.intercept('GET', `/api/v1/customer/${customerId}/services`, noServices).as('services');
      cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/activities+delivered`,
      }).as('activities');
      cy.intercept('GET', `/api/v3/autoship-activities/**`, {
        fixture: `/activities/order`,
      }).as('orders');
      cy.visitActivityFeed();
      cy.wait(['@customer', '@tags', '@services','@activities']);
    });

    it("should render the 'none' for customer with no subscriptions", () => {
      cy.get('[data-testid="disabledIcon"]')
        .first()
        .scrollIntoView()
        .should('exist')
        .and('be.visible');
    });
  });

  describe('customer information is edited', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/v1/customer/${customerId}`, customer).as('customer');
      cy.intercept('GET', `/api/v1/customer/${customerId}/tags?appliedTagsOnly=true`, tags).as(
        'tags',
      );
      cy.intercept('GET', `/api/v1/customer/${customerId}/services`, services).as('services');
      cy.intercept('GET', `/api/v3/activities/?customerId=${customerId}**`, {
        fixture: `/activities/activities+delivered`,
      }).as('activities');
      cy.intercept('GET', `/api/v3/autoship-activities/**`, {
        fixture: `/activities/order`,
      }).as('orders');
      cy.visitActivityFeed();
      cy.wait(['@customer', '@tags', '@services','@activities']);
      cy.getByTestId('edit-customer-info').click();
    });

    it('Edit page is rendered', () => {
      cy.contains('Edit Customer Details').should('be.visible');
      cy.get('input[name="email"]').should('have.value', email);
      cy.get('input[name="location"]').should('have.value', `${address.city}, ${address.state}`);
    });

    it('Edit email and save', () => {
      cy.get('input[name="email"]').type('{selectall}{backspace}abc');
      cy.contains('Invalid email').should('exist');
      cy.get('button').contains('Save').should('not.be.enabled');

      cy.get('input[name="email"]').type('{selectall}{backspace}abc.');
      cy.contains('Invalid email').should('exist');

      cy.get('input[name="email"]').type('{selectall}{backspace}abc@a.com');
      cy.contains('Invalid email').should('not.exist');

      cy.get('button').contains('Save').should('not.be.disabled');
      cy.get('button').contains('Save').click();
      cy.contains('Customer Details').should('exist');
    });

    it('Edit name and save', () => {
      cy.get('input[name="fullName"]').type('{selectall}{backspace}');
      cy.contains('Invalid name').should('exist');
      cy.get('button').contains('Save').should('not.be.enabled');

      cy.get('input[name="fullName"]').type('{selectall}{backspace}abc');
      cy.contains('Invalid name').should('not.exist');

      cy.get('button').contains('Save').should('not.be.disabled');
      cy.get('button').contains('Save').click();
      cy.contains('Customer Details').should('exist');
    });

    it('Edit phone and save', () => {
      cy.get('input[name="phone"]').type('213123');
      cy.contains('Invalid phone').should('exist');
      cy.get('button').contains('Save').should('not.be.enabled');
      cy.get('input[name="phone"]').type('2345678923');
      cy.contains('Invalid phone').should('not.exist');
      cy.get('button').contains('Save').should('not.be.disabled');
      cy.get('button').contains('Save').click();
      cy.contains('Customer Details').should('exist');
    });

    it('cancel the edit', () => {
      cy.getByTestId('cancel-edit').should('not.be.disabled');
      cy.contains('Cancel').click();
      cy.contains('Customer Details').should('exist');
    });

    describe('when customer status is changed', () => {
      it('should render current status in dropdown', () => {
        cy.intercept('GET', `/api/v1/customer/${customerId}`, { ...customer, status: 'ACTIVE' }).as(
          'customer',
        );
        cy.withPanel({ interactionPanel: 'customerInformationEditor' });
        cy.wait('@customer');
        cy.get('[name="status"]').invoke('val').should('eq', 'ACTIVE');
      });

      describe('when changing status to inactive', () => {
        it('should render help text copy', () => {
          cy.intercept('GET', `/api/v1/customer/${customerId}`, {
            ...customer,
            status: 'ACTIVE',
          }).as('customer');
          cy.withPanel({ interactionPanel: 'customerInformationEditor' });
          cy.wait('@customer');
          cy.get('[data-testid="edit-status"]').find('.MuiInputBase-formControl').click();
          cy.get('[role="listbox"]').find('li').contains('INACTIVE').click();
          cy.get('[data-testid="edit-status"]').find('p').should('exist');
        });
      });

      describe('when current status is inactive', () => {
        it('should not render help text copy', () => {
          cy.intercept('GET', `/api/v1/customer/${customerId}`, {
            ...customer,
            status: 'INACTIVE',
          }).as('customer');
          cy.withPanel({ interactionPanel: 'customerInformationEditor' });
          cy.wait('@customer');
          cy.get('[data-testid="edit-status"]').find('p').should('not.exist');
        });
      });
    });
  });
});
