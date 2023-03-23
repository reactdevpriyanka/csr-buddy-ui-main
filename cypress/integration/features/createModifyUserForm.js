import userInfo from '../../fixtures/user/user_details';

describe.skip('Create Modify User', () => {
  before(() => cy.login());

  it('Should show the empty create user screen with save user and change password buttons disabled', () => {

    cy.visitCreateModifyUser();
    cy.getByTestId('createModifyUser-title').should('exist');
    cy.getByTestId('createModifyUser-title').contains('Create User');

    cy.getByTestId('createModifyUser-logonId-field').should('exist');
    cy.getByTestId('createModifyUser-logonId-field').find('input').should('have.value', '');

    cy.getByTestId('createModifyUser-password-field').should('exist');
    cy.getByTestId('createModifyUser-password-field').find('input').should('have.value', '');

    cy.getByTestId('createModifyUser-displayName-field').should('exist');
    cy.getByTestId('createModifyUser-displayName-field').find('input').should('have.value', '');

    cy.getByTestId('createModifyUser-emailAddress-field').should('exist');
    cy.getByTestId('createModifyUser-emailAddress-field').find('input').should('have.value', '');

    cy.getByTestId('createModifyUser-registerType-field').should('exist');
    cy.getByTestId('createModifyUser-registerType-field').find('li').contains('A');


    cy.getByTestId('createModifyUser-status-field').should('exist');
    cy.getByTestId('createModifyUser-status-field').find('li').contains('ACTIVE');


    cy.getByTestId('createModifyUser-cancel-button').should('not.be.disabled');
    cy.getByTestId('createModifyUser-save-user-button').should('be.disabled');
    cy.getByTestId('createModifyUser-change-password-button').should('be.disabled');

    cy.getByTestId('createModifyUser-shuttle').should('exist');
  });

  it('Should show create user screen enable save user buttons on value change', () => {

    cy.visitCreateModifyUser();
    cy.getByTestId('createModifyUser-save-user-button').should('be.disabled');

    cy.getByTestId('createModifyUser-logonId-field').type(`${userInfo.data.attributes.loginId}`);
    cy.getByTestId('createModifyUser-password-field').type(`${userInfo.data.attributes.password}`);
    cy.getByTestId('createModifyUser-displayName-field').type(`${userInfo.data.attributes.fullName}`);
    cy.getByTestId('createModifyUser-emailAddress-field').type(`${userInfo.data.attributes.email}`);

    cy.getByTestId('createModifyUser-save-user-button').should('not.be.disabled');
  });

  it('should return back to findUser page on cancel', () => {
    cy.getByTestId('createModifyUser-cancel-button').click();
    cy.location('pathname').should('eq', `/app/users/findUsers`);;
  });

  describe.skip('Edit User', () => {

    it('Should show populated edit user screen with save user button disabled and change password buttons enabled', () => {
  
      cy.intercept('GET', `/gateway/employeeproxy/v1/employee/accounts/loginId/**`, userInfo)
      .as('userInfo');

      cy.visitCreateModifyUser({loginId: userInfo.data.attributes.loginId});

      cy.wait('@userInfo');

      cy.getByTestId('createModifyUser-title').should('exist');
      cy.getByTestId('createModifyUser-title').contains('Edit User');
  
      cy.getByTestId('createModifyUser-logonId-field').should('exist');


      cy.getByTestId('createModifyUser-logonId-field').find('input').should('have.value', userInfo.data.attributes.loginId);
      
  
      cy.findByTestId('createModifyUser-password-field').should('not.exist');


      cy.getByTestId('createModifyUser-displayName-field').should('exist');
      cy.getByTestId('createModifyUser-displayName-field').find('input').should('have.value', userInfo.data.attributes.fullName);
  
      cy.getByTestId('createModifyUser-emailAddress-field').should('exist');
      cy.getByTestId('createModifyUser-emailAddress-field').find('input').should('have.value', userInfo.data.attributes.email);
  
      cy.getByTestId('createModifyUser-registerType-field').should('exist');
      cy.getByTestId('createModifyUser-registerType-field').find('li').contains('S');
  
      cy.getByTestId('createModifyUser-status-field').should('exist');
      cy.getByTestId('createModifyUser-status-field').find('li').contains('ACTIVE');
  
      cy.getByTestId('createModifyUser-cancel-button').should('not.be.disabled');
      cy.getByTestId('createModifyUser-save-user-button').should('be.disabled');
      cy.getByTestId('createModifyUser-change-password-button').should('not.be.disabled');
  
      cy.getByTestId('createModifyUser-shuttle').should('exist');
    });
  });
});
