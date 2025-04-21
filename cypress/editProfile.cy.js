describe('Edit Profile Page', () => {
  beforeEach(() => {
    // Mock the user data fetch before navigating
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
    
    // Login before each test
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('bar1234');
    cy.get('#password').type('12345678');
    cy.get('#login-button').click();
    
    // Wait for redirect to map page
    cy.url().should('include', '/map', { timeout: 7000 });
    
    // Navigate directly to profile edit page instead of using the sidebar
    cy.visit('http://localhost:5173/profile/edit');
    
    // Wait for data to load
    cy.wait('@getUserData');
  });

  it('should display edit profile form with user data', () => {
    cy.get('[data-cy="edit-profile-title"]').should('be.visible');
    
    // Check if form fields are populated with user data using data-cy attributes
    cy.get('[data-cy="username-field"] input').should('have.value', 'bar1234').and('be.disabled');
    cy.get('[data-cy="fname-field"] input').should('have.value', 'Bar');
    cy.get('[data-cy="lname-field"] input').should('have.value', 'David');
    cy.get('[data-cy="email-field"] input').should('have.value', 'bar@gmail.com');
    
    // Check if buttons are present using data-cy attributes
    cy.get('[data-cy="update-profile-button"]').should('be.visible');
    cy.get('[data-cy="cancel-button"]').should('be.visible');
  });

  it('should validate form fields', () => {
    // Clear required fields and verify they're empty
    cy.get('[data-cy="fname-input"]').clear().should('have.value', '');
    cy.get('[data-cy="lname-input"]').clear().should('have.value', '');
    cy.get('[data-cy="email-input"]').clear().should('have.value', '');
    
    // Attempt to submit the form with empty fields
    cy.get('[data-cy="update-profile-button"]').click();

    // Verify fields are still empty after submit attempt
    cy.get('[data-cy="fname-input"]').should('have.value', '');
    cy.get('[data-cy="lname-input"]').should('have.value', '');
    cy.get('[data-cy="email-input"]').should('have.value', '');
    
    // Add valid data for first and last name
    cy.get('[data-cy="fname-input"]').type('Test').should('have.value', 'Test');
    cy.get('[data-cy="lname-input"]').type('User').should('have.value', 'User');
    
    // Add invalid email
    cy.get('[data-cy="email-input"]').type('invalid-email').should('have.value', 'invalid-email');
    
    // Try to submit again
    cy.get('[data-cy="update-profile-button"]').click();
    
    // Verify fields still have their entered values
    cy.get('[data-cy="fname-input"]').should('have.value', 'Test');
    cy.get('[data-cy="lname-input"]').should('have.value', 'User');
    cy.get('[data-cy="email-input"]').should('have.value', 'invalid-email');
    
    // Verify the form didn't proceed by confirming we're still on the same page
    cy.url().should('include', '/profile/edit');
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
    cy.get('[data-cy="fname-field"] input').clear().type('Updated First');
    cy.get('[data-cy="lname-field"] input').clear().type('Updated Last');
    cy.get('[data-cy="email-field"] input').clear().type('updated@example.com');
    
    // Submit the form
    cy.get('[data-cy="update-profile-button"]').click();
    
    // Wait for the update API call
    cy.wait('@updateUser');
    
    // Should show success message
    cy.get('[data-cy="form-alert"]', { timeout: 5000 })
      .should('exist')
      .and('contain.text', 'User information updated successfully');
    
    // Form should be updated with new values
    cy.get('[data-cy="fname-field"] input').should('have.value', 'Updated First');
    cy.get('[data-cy="lname-field"] input').should('have.value', 'Updated Last');
    cy.get('[data-cy="email-field"] input').should('have.value', 'updated@example.com');
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
    cy.get('[data-cy="fname-field"] input').clear().type('Test');
    cy.get('[data-cy="lname-field"] input').clear().type('User');
    cy.get('[data-cy="email-field"] input').clear().type('test@example.com');
    
    // Submit the form
    cy.get('[data-cy="update-profile-button"]').click();
    
    // Wait for the failed update API call
    cy.wait('@updateUserFail');
    
    // Should show error message
    cy.get('[data-cy="form-alert"]', { timeout: 5000 })
      .should('exist')
      .and('contain.text', 'Error updating user information');
  });

  it('should navigate back to map when clicking cancel', () => {
    cy.get('[data-cy="cancel-button"]').click();
    cy.url().should('include', '/map');
  });
});