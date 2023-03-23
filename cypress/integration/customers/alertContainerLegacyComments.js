describe.skip('1.0 comments tab', () => {
  const openCommentsTabWith = (comments = []) => {
    cy.intercept('GET', `/api/v3/activities/?customerId=**`, {
      fixture: `/activities/activities+delivered`,
    }).as('activities');
    cy.intercept('GET', '/api/v1/customer/*/comments', comments).as('comments');
    cy.visitActivityFeed();
    cy.wait('@activities');
    cy.wait(500);
    cy.get('[aria-label="comments"]').should('exist').click({ force: false });
    cy.get('[data-testid="1.0 Comments_tab"]').should('exist').click({ force: true });
    cy.wait('@comments');
  };

  beforeEach(() => cy.login());

  describe('with sticky comments', () => {
    beforeEach(() => {
      const comments = [
        {
          id: '0f8aa701-892c-4c87-8d67-bf4c5293f318',
          customerId: '256902227',
          comment: 'Testing sticky',
          stickied: true,
          createdBy: '81',
          createdDate: 1647457383.647,
        },
        {
          id: 'a37f13b9-9f40-40c8-8a16-a7f644373679',
          customerId: '256902227',
          comment: 'Test comment',
          stickied: false,
          createdBy: '81',
          createdDate: 1647457378.136,
        },
      ];

      openCommentsTabWith(comments);
    });

    it('should see comments', () => {
      cy.get('[data-testid^="comment-card-"]')
        .should('exist')
        .invoke('children')
        .its('length')
        .should('eq', 2);
    });

    it('should have one sticky comment', () => {
      cy.get('[data-testid="comment-container"]').find('.sticky').its('length').should('eq', 1);
    });

    it('should show end message', () => {
      cy.contains('p', 'End of Comments')
        .should('exist')
        .and('be.visible');
    });
  });

  describe('with no sticky comments list', () => {
    beforeEach(() => openCommentsTabWith([]));

    it('should not throw error if no sticky comment', () => {
      cy.get('[data-testid="comment-container"]').should('exist');
    });

    it('should show null message', () => {
      cy.get('[data-testid="comments:null"]')
        .should('exist')
        .invoke('text')
        .should('match', /There are no comments to display/);
    });
  });
});
