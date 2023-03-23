import userInfo from '../../fixtures/user/user_details';

describe.skip('Find user', () => {
  before(() => cy.login());
  


  it('Should show the find user screen with find user button disabled', () => {

    cy.visitFindUser();
    cy.getByTestId('find-user-title').should('exist');
    cy.getByTestId('find-user-logonId-field').should('exist');

    cy.getByTestId('find-user-find-user-button').should('exist');
    cy.getByTestId('find-user-find-user-button').should('be.disabled');

    cy.getByTestId('find-user-create-user-button').should('exist');
    cy.getByTestId('find-user-create-user-button').should('not.be.disabled');

  });

  it('Should enable find user button when logon id is entered', () => {

    cy.visitFindUser();

    cy.getByTestId('find-user-find-user-button').should('exist');
    cy.getByTestId('find-user-find-user-button').should('be.disabled');

    cy.getByTestId('find-user-logonId-field').type(`${userInfo.data.attributes.loginId}`);


    cy.getByTestId('find-user-find-user-button').should('not.be.disabled');

    cy.intercept('GET', `/gateway/employeeproxy/v1/employee/accounts/loginId/**`, userInfo)
    .as('userInfo');

    cy.getByTestId('find-user-find-user-button').click({ force: true })

    cy.wait('@userInfo')

    cy.location('pathname').should('eq', `/app/users/createModifyUser`);

  });

});
