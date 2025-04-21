describe('Edit Profile Page', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('bar1234');
    cy.get('#password').type('12345678');
    cy.get('#login-button').click();
    
    // Wait for redirect to map page
    cy.url().should('include', '/map', { timeout: 7000 });
    
    // Navigate to profile edit page
    cy.contains('Profile').click();
    cy.url().should('include', '/profile/edit');
    
    // Mock the user data fetch
    cy.intercept('GET', 'http://localhost:5001/users/bar1234', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          fName: 'Bar',
          lName: 'David',
          email: 'bar@gmail.com',
          username: 'bar1234'
        }
      }
    }).as('getUserData');
    
    // Wait for data to load
    cy.wait('@getUserData');
  });

  it('should display edit profile form with user data', () => {
    cy.contains('Edit Profile').should('be.visible');
    
    // Check if form fields are populated with user data
    cy.get('input[name="username"]').should('have.value', 'bar1234').and('be.disabled');
    cy.get('input[name="fName"]').should('have.value', 'Bar');
    cy.get('input[name="lName"]').should('have.value', 'David');
    cy.get('input[name="email"]').should('have.value', 'bar@gmail.com');
    
    // Check if buttons are present
    cy.contains('Update Profile').should('be.visible');
    cy.contains('Cancel').should('be.visible');
  });

  it('should validate form fields', () => {
    // Clear required fields
    cy.get('input[name="fName"]').clear();
    cy.get('input[name="lName"]').clear();
    cy.get('input[name="email"]').clear();
    
    // Try to update with empty fields
    cy.contains('Update Profile').click();
    
    // Should show validation error
    cy.contains('All fields are required').should('be.visible');
    
    // Test invalid email format
    cy.get('input[name="fName"]').type('Test');
    cy.get('input[name="lName"]').type('User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.contains('Update Profile').click();
    
    cy.contains('Please enter a valid email address').should('be.visible');
  });

  it('should update profile successfully', () => {
    // Mock the update API call
    cy.intercept('PUT', 'http://localhost:5001/users/update', {
      statusCode: 200,
      body: {
        success: true,
        message: 'User information updated successfully',
        user: {
          fName: 'Updated First',
          lName: 'Updated Last',
          email: 'updated@example.com',
          username: 'bar1234'
        }
      }
    }).as('updateUser');
    
    // Update form fields
    cy.get('input[name="fName"]').clear().type('Updated First');
    cy.get('input[name="lName"]').clear().type('Updated Last');
    cy.get('input[name="email"]').clear().type('updated@example.com');
    
    // Submit the form
    cy.contains('Update Profile').click();
    
    // Wait for the update API call
    cy.wait('@updateUser');
    
    // Should show success message
    cy.contains('User information updated successfully').should('be.visible');
    
    // Form should be updated with new values
    cy.get('input[name="fName"]').should('have.value', 'Updated First');
    cy.get('input[name="lName"]').should('have.value', 'Updated Last');
    cy.get('input[name="email"]').should('have.value', 'updated@example.com');
  });

  it('should handle update failure', () => {
    // Mock a failed update
    cy.intercept('PUT', 'http://localhost:5001/users/update', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Error updating user information'
      }
    }).as('updateUserFail');
    
    // Update form fields
    cy.get('input[name="fName"]').clear().type('Test');
    cy.get('input[name="lName"]').clear().type('User');
    cy.get('input[name="email"]').clear().type('test@example.com');
    
    // Submit the form
    cy.contains('Update Profile').click();
    
    // Wait for the failed update API call
    cy.wait('@updateUserFail');
    
    // Should show error message
    cy.contains('Error updating user information').should('be.visible');
  });

  it('should navigate back to map when clicking cancel', () => {
    cy.contains('Cancel').click();
    cy.url().should('include', '/map');
  });
});