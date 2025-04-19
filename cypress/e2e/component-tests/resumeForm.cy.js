
describe('Resume Form Component', () => {
  it('fills and submits the form', () => {
    cy.visit('/');
    cy.get('input[name="fullName"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('textarea[name="summary"]').type('Experienced developer...');
    cy.get('form').submit();
    cy.contains('Resume Preview').should('exist');
  });
});
