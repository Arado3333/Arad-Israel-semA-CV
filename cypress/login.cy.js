describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should display login form with all elements', () => {
    cy.contains('Welcome Back!').should('be.visible');
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#login-button').should('be.visible');
    cy.contains('Register Page').should('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('#username').type('invalid_user');
    cy.get('#password').type('wrong_password');
    cy.get('#login-button').click();
    
    // Wait for the error response from server
    cy.contains('Incorrect credentials or unregistered', { timeout: 5000 }).should('be.visible');
  });

  it('should navigate to register page when clicking register button', () => {
    cy.contains('Register Page').click();
    cy.url().should('include', '/register');
    cy.contains('Create an Account').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.get('#username').type('bar1234');
    cy.get('#password').type('12345678');
    cy.get('#login-button').click();
    
    // Wait for the success message
    cy.contains('Authentication successful', { timeout: 5000 }).should('be.visible');
    
    // Should redirect to the map page after login
    cy.url().should('include', '/map', { timeout: 7000 });
  });

  it('should handle Enter key press for login submission', () => {
    cy.get('#username').type('bar1234');
    cy.get('#password').type('12345678{enter}');
    
    // Wait for the success message
    cy.contains('Authentication successful', { timeout: 5000 }).should('be.visible');
  });
});