describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/register');
  });

  it('should display registration form with all elements', () => {
    cy.contains('Create an Account').should('be.visible');
    cy.get('#tf-fName').should('be.visible');
    cy.get('#tf-lName').should('be.visible');
    cy.get('#tf-email').should('be.visible');
    cy.get('#tf-username').should('be.visible');
    cy.get('#tf-password').should('be.visible');
    cy.contains('Register').should('be.visible');
    cy.contains('Already have an account? Login').should('be.visible');
  });

  it('should validate required fields', () => {
    // Click register without filling any fields
    cy.contains('Register').click();
    cy.contains('All fields are required.').should('be.visible');
    
    // Fill only some fields
    cy.get('#tf-fName').type('Test');
    cy.get('#tf-lName').type('User');
    cy.contains('Register').click();
    cy.contains('All fields are required.').should('be.visible');
  });

  it('should validate email format', () => {
    // Fill all fields but with invalid email
    cy.get('#tf-fName').type('Test');
    cy.get('#tf-lName').type('User');
    cy.get('#tf-email').type('invalid-email');
    cy.get('#tf-username').type('testuser');
    cy.get('#tf-password').type('12345678');
    cy.contains('Register').click();
    
    cy.contains('Invalid email format.').should('be.visible');
  });

  it('should validate password length', () => {
    // Fill all fields but with short password
    cy.get('#tf-fName').type('Test');
    cy.get('#tf-lName').type('User');
    cy.get('#tf-email').type('test@example.com');
    cy.get('#tf-username').type('testuser');
    cy.get('#tf-password').type('123');
    cy.contains('Register').click();
    
    cy.contains('Password must be at least 8 characters long.').should('be.visible');
  });

  it('should navigate to login page when clicking login link', () => {
    cy.contains('Already have an account? Login').click();
    cy.url().should('include', '/login');
    cy.contains('Welcome Back!').should('be.visible');
  });

  it('should show error for existing username', () => {
    // Use an existing username from users.json
    cy.get('#tf-fName').type('Test');
    cy.get('#tf-lName').type('User');
    cy.get('#tf-email').type('test@example.com');
    cy.get('#tf-username').type('bar1234'); // Existing username
    cy.get('#tf-password').type('12345678');
    cy.contains('Register').click();
    
    cy.contains('User already exists', { timeout: 5000 }).should('be.visible');
  });

  it('should register a new user successfully', () => {
    // Generate a random username to avoid conflicts
    const randomUsername = 'user_' + Math.floor(Math.random() * 10000);
    
    cy.get('#tf-fName').type('Test');
    cy.get('#tf-lName').type('User');
    cy.get('#tf-email').type(`${randomUsername}@example.com`);
    cy.get('#tf-username').type(randomUsername);
    cy.get('#tf-password').type('12345678');
    cy.contains('Register').click();
    
    cy.contains('User created successfully', { timeout: 5000 }).should('be.visible');
    
    // Should redirect to login page after successful registration
    cy.url().should('include', '/login', { timeout: 7000 });
  });
});