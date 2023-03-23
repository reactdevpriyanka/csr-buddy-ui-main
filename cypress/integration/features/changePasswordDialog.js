import userInfo from '../../fixtures/user/user_details';

describe.skip('Change Password Dialog', () => {
  before(() => cy.login());

  const dummyPassword = "dummyPassword";

  describe('Edit User', () => {

    it('Should show populated edit user screen with save user button disabled and change password buttons enabled', () => {
  
      cy.intercept('GET', `/gateway/employeeproxy/v1/employee/accounts/loginId/**`, userInfo)
      .as('userInfo');

      cy.visitCreateModifyUser({loginId: userInfo.data.attributes.loginId});

      cy.wait('@userInfo');

      cy.getByTestId('createModifyUser-title').should('exist');
      cy.getByTestId('createModifyUser-title').contains('Edit User');

  
      cy.getByTestId('createModifyUser-cancel-button').should('not.be.disabled');
      cy.getByTestId('createModifyUser-save-user-button').should('be.disabled');
      cy.getByTestId('createModifyUser-change-password-button').should('not.be.disabled');

      cy.getByTestId('createModifyUser-change-password-button').click();

      cy.getByTestId('passwordResetDialog').should('exist').within(() => {
        cy.getByTestId('base-dialog-ok-button').should('be.disabled');
        cy.getByTestId('base-dialog-close-button').should('not.be.disabled');

        cy.getByTestId('change-password-password-field').should('exist');
        cy.getByTestId('change-password-password-field').find('input').should('have.value', '');

        cy.getByTestId('change-password-validated-password-field').should('exist');
        cy.getByTestId('change-password-validated-password-field').find('input').should('have.value', '');

        cy.getByTestId('base-dialog-close-button').click();
      });

      cy.findByTestId('passwordResetDialog').should('not.exist');
    
    });

    it('Should enable change password dialog ok button when password entered', () => {
  
      cy.intercept('GET', `/gateway/employeeproxy/v1/employee/accounts/loginId/**`, userInfo)
      .as('userInfo');

      cy.visitCreateModifyUser({loginId: userInfo.data.attributes.loginId});

      cy.wait('@userInfo');

      cy.getByTestId('createModifyUser-title').should('exist');
      cy.getByTestId('createModifyUser-title').contains('Edit User');

  
      cy.getByTestId('createModifyUser-cancel-button').should('not.be.disabled');
      cy.getByTestId('createModifyUser-save-user-button').should('be.disabled');
      cy.getByTestId('createModifyUser-change-password-button').should('not.be.disabled');

      cy.getByTestId('createModifyUser-change-password-button').click();

      
      cy.intercept('PUT', '/gateway/employeeproxy/v1/employee/accounts/userId/**/password', { statusCode: 200 }).as('resetPassword');
      cy.getByTestId('passwordResetDialog').should('exist').within(() => {
        cy.getByTestId('base-dialog-ok-button').should('be.disabled');
        cy.getByTestId('base-dialog-close-button').should('not.be.disabled');

        cy.getByTestId('change-password-password-field').should('exist');
        cy.getByTestId('change-password-password-field').find('input').should('have.value', '');

        cy.getByTestId('change-password-validated-password-field').should('exist');
        cy.getByTestId('change-password-validated-password-field').find('input').should('have.value', '');
        
        cy.getByTestId('change-password-password-field').type(dummyPassword);

        cy.getByTestId('base-dialog-ok-button').should('be.disabled');
        cy.contains('Passwords must match').should('exist');

        cy.getByTestId('change-password-validated-password-field').type(dummyPassword);

        cy.getByTestId('base-dialog-ok-button').should('not.be.disabled');
        cy.contains('Passwords must match').should('not.exist');

        cy.getByTestId('base-dialog-ok-button').click({ force: true });
      });
      cy.wait('@resetPassword');
      cy.contains('Password changed').should('exist');
      cy.findByTestId('passwordResetDialog').should('not.exist');
    
    });

    it('Should show error message when change password fails', () => {

      cy.intercept('GET', `/gateway/employeeproxy/v1/employee/accounts/loginId/**`, userInfo)
      .as('userInfo');

      cy.visitCreateModifyUser({loginId: userInfo.data.attributes.loginId});

      cy.wait('@userInfo');

      cy.getByTestId('createModifyUser-title').should('exist');
      cy.getByTestId('createModifyUser-title').contains('Edit User');

  
      cy.getByTestId('createModifyUser-cancel-button').should('not.be.disabled');
      cy.getByTestId('createModifyUser-save-user-button').should('be.disabled');
      cy.getByTestId('createModifyUser-change-password-button').should('not.be.disabled');

      cy.getByTestId('createModifyUser-change-password-button').click();

      
      cy.intercept('PUT', '/gateway/employeeproxy/v1/employee/accounts/userId/**/password', { statusCode: 500 }).as('resetPassword');
      cy.getByTestId('passwordResetDialog').should('exist').within(() => {
        cy.getByTestId('base-dialog-ok-button').should('be.disabled');
        cy.getByTestId('base-dialog-close-button').should('not.be.disabled');

        cy.getByTestId('change-password-password-field').should('exist');
        cy.getByTestId('change-password-password-field').find('input').should('have.value', '');
        
        cy.getByTestId('change-password-password-field').type(dummyPassword);
        cy.getByTestId('change-password-validated-password-field').type(dummyPassword);
        cy.getByTestId('base-dialog-ok-button').should('not.be.disabled');

        cy.getByTestId('base-dialog-ok-button').click({ force: true });
      });
      cy.wait('@resetPassword');
      cy.contains('Failed to reset the User password').should('exist');
      cy.findByTestId('passwordResetDialog').should('exist');
    
    });

  });

});
