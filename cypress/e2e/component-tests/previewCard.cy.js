
describe('Preview Card Component', () => {
  it('displays user resume data', () => {
    cy.visit('/');
    cy.contains('Resume Preview').click();
    cy.contains('John Doe').should('exist');
    cy.contains('Experienced developer...').should('exist');
  });
});
