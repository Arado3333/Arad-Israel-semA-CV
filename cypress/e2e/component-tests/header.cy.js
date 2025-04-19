
describe('Header Component', () => {
  it('displays personalized greeting', () => {
    cy.visit('/');
    cy.contains('Hello,').should('exist');
  });
});
