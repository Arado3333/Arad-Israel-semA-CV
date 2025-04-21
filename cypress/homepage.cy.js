describe('Homepage (MyCV) After Login', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('bar1234');
    cy.get('#password').type('12345678');
    cy.get('#login-button').click();
    
    // Wait for redirect to map page
    cy.url().should('include', '/map', { timeout: 7000 });
  });

  it('should display the dashboard layout', () => {
    cy.get('nav').should('be.visible');
  });

  it('should display loading state when no CVs are available', () => {
    // This test simulates when no CVs are available
    // We intercept the API call and return an empty array
    cy.intercept('GET', 'http://localhost:5001/get-resume', { body: [] }).as('getEmptyCVs');
    cy.reload();
    cy.wait('@getEmptyCVs');
    
    cy.contains('No CV data available').should('be.visible');
  });

  it('should display CV cards when data is available', () => {
    // Create a mock CV data
    const mockCV = {
      fullName: 'Test User',
      location: 'Test Location',
      currentRole: 'Software Developer',
      summary: 'A test professional summary',
      teamExperience: 'Test work history',
      education: 'Test education',
      skills: 'JavaScript, React, Node.js',
      achievements: 'Test achievements',
      careerGoals: 'Test career goals',
      hobbies: 'Test hobbies'
    };
    
    cy.intercept('GET', 'http://localhost:5001/get-resume', { body: [mockCV] }).as('getCVs');
    cy.reload();
    cy.wait('@getCVs');
    
    // Check if CV card is displayed with correct data
    cy.contains('Test User').should('be.visible');
    cy.contains('PROFESSIONAL SUMMARY').should('be.visible');
    cy.contains('A test professional summary').should('be.visible');
    cy.contains('WORK HISTORY').should('be.visible');
    cy.contains('Test work history').should('be.visible');
    cy.contains('EDUCATION').should('be.visible');
    cy.get('[data-cy="skills-heading"]').should('be.visible');
    cy.contains('JavaScript').should('be.visible');
    cy.contains('Delete CV', { timeout: 5000 }).should('exist');
    // Using exist instead of visible due to potential overflow clipping issues
  });

  it('should handle CV deletion', () => {
    // Create a mock CV data
    const mockCV = { fullName: 'Test User', location: 'Test Location' };
    
    cy.intercept('GET', 'http://localhost:5001/get-resume', { body: [mockCV] }).as('getCVs');
    cy.intercept('DELETE', 'http://localhost:5001/delete-resume/0', { 
      body: { success: true, message: 'CV deleted successfully' } 
    }).as('deleteCV');
    
    cy.reload();
    cy.wait('@getCVs');
    
    // Click the delete button using the data-cy attribute
    cy.get('[data-cy="delete-cv-button"]').click();
    cy.wait('@deleteCV');
    
    // After deletion, the CV should no longer be visible
    cy.contains('No CV data available').should('be.visible');
  });

  it('should have working navigation links', () => {
    // Test navigation to Chat page
    const chat = cy.get('.css-1y8nxit-MuiDrawer-docked > .MuiPaper-root > .MuiBox-root > .MuiList-root > :nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root');
    chat.click();
    cy.url().should('include', '/chat');
    
    // Test navigation to Profile
    const profile = cy.get('.css-1y8nxit-MuiDrawer-docked > .MuiPaper-root > .MuiBox-root > .MuiList-root > :nth-child(4) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root');
    profile.click();
    cy.url().should('include', '/profile/edit');
    
    // Go back to Map page
    const dashboard = cy.get('.css-1y8nxit-MuiDrawer-docked > .MuiPaper-root > .MuiBox-root > .MuiList-root > :nth-child(2) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root')
    dashboard.click();
    cy.url().should('include', '/map');
  });
});