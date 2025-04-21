describe('Chat Page', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:5173/login');
    cy.get('#username').type('bar1234');
    cy.get('#password').type('12345678');
    cy.get('#login-button').click();
    
    // Wait for redirect to map page
    cy.url().should('include', '/map', { timeout: 7000 });
    
    // Navigate to chat page
    cy.contains('Chat').click();
    cy.url().should('include', '/chat');
  });

  it('should display chat interface with initial greeting', () => {
    cy.contains('Job Interview Chat').should('be.visible');
    cy.contains('Welcome to the job interview assistant').should('be.visible');
    cy.get('input[label="Type your response"]').should('be.visible');
    cy.contains('Send').should('be.visible');
    cy.contains('End Conversation').should('be.visible').and('be.disabled');
  });

  it('should display first question about full name', () => {
    cy.contains('What is your full name?').should('be.visible');
  });

  it('should allow user to answer questions and proceed to next question', () => {
    // Answer first question (full name)
    cy.get('input[label="Type your response"]').type('Test User');
    cy.contains('Send').click();
    
    // User message should appear in chat
    cy.contains('Test User').should('be.visible');
    
    // Should proceed to next question about current role
    cy.contains('What is your current role?').should('be.visible');
  });

  it('should go through the entire questionnaire', () => {
    // This is a longer test that goes through all questions
    const answers = [
      'Test User',
      'Software Developer',
      'JavaScript, React, Node.js',
      'Computer Science Degree',
      'Worked in agile teams',
      'Completed several projects',
      'Become a senior developer',
      'Reading, hiking',
      'New York'
    ];
    
    // Mock the AI processing call to avoid actual API calls
    cy.intercept('POST', '**/chatCompletion', {
      statusCode: 200,
      body: {
        choices: [
          {
            message: {
              content: 'SUMMARY: Professional summary here\nJOB_HISTORY: Job history here\nKEY_QUALIFICATIONS: Key qualifications here'
            }
          }
        ]
      }
    }).as('aiProcessing');
    
    // Go through all questions
    answers.forEach((answer, index) => {
      // Wait for question to appear (with some delay for the first one)
      if (index === 0) {
        cy.contains('What is your full name?', { timeout: 5000 }).should('be.visible');
      }
      
      cy.get('input[label="Type your response"]').should('be.visible').type(answer);
      cy.contains('Send').click();
      
      // Verify answer was sent
      cy.contains(answer).should('be.visible');
    });
    
    // After answering all questions, should see processing message
    cy.contains('Thank you for providing all the information').should('be.visible');
    
    // End Conversation button should be enabled after processing
    cy.contains('End Conversation').should('not.be.disabled');
  });

  it('should save resume data when ending conversation', () => {
    // Mock the server call for saving resume
    cy.intercept('POST', 'http://localhost:5001/save-resume', {
      statusCode: 200,
      body: { success: true, message: 'Resume data saved successfully' }
    }).as('saveResume');
    
    // Go through a shorter version of the test with just one question
    cy.get('input[label="Type your response"]').type('Test User');
    cy.contains('Send').click();
    
    // Mock the remaining questions quickly
    for (let i = 0; i < 8; i++) {
      cy.get('input[label="Type your response"]').type(`Answer ${i}`);
      cy.contains('Send').click();
    }
    
    // Mock the AI processing
    cy.intercept('POST', '**/chatCompletion', {
      statusCode: 200,
      body: {
        choices: [
          {
            message: {
              content: 'SUMMARY: Test summary\nJOB_HISTORY: Test job history\nKEY_QUALIFICATIONS: Test qualifications'
            }
          }
        ]
      }
    }).as('aiProcessing');
    
    // Wait for processing to complete
    cy.contains('I\'ve processed your information', { timeout: 10000 }).should('be.visible');
    
    // End the conversation
    cy.contains('End Conversation').click();
    
    // Should have made a server call to save resume data
    cy.wait('@saveResume');
    
    // Should show confirmation message
    cy.contains('Your resume data has been saved successfully').should('be.visible');
  });
});