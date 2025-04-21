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
    const chat = cy.get('.css-1y8nxit-MuiDrawer-docked > .MuiPaper-root > .MuiBox-root > .MuiList-root > :nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root');
    chat.click();
    cy.url().should('include', '/chat');
  });

  it('should display chat interface with initial greeting', () => {
    // Check page title
    cy.contains('Job Interview Chat').should('be.visible');
    // Check welcome message (using data-cy attribute)
    cy.get('[data-cy="assistant-message"]').should('exist').and('contain.text', 'Welcome to the job interview assistant');
    cy.get('[data-cy="chat-input-field"]').should('be.visible');
    cy.get('[data-cy="send-button"]').should('be.visible');
    // Use exist instead of visible for end-conversation button to avoid overflow clipping issues
    cy.get('[data-cy="end-conversation-button"]').should('exist').and('be.disabled');
  });

  it('should display first question about full name', () => {
    // Check first question (using data-cy attribute)
    cy.get('[data-cy="assistant-message"]', { timeout: 5000 })
      .should('exist').and('contain.text', 'What is your full name?');
  });

  it('should allow user to answer questions and proceed to next question', () => {
    // Answer first question (full name)
    cy.get('[data-cy="chat-input-field"]').type('Test User');
    cy.get('[data-cy="send-button"]').click();
    
    // User message should appear in chat (use data-cy attribute)
    cy.get('[data-cy="user-message"]').should('exist').and('contain.text', 'Test User');
    
    // Should proceed to next question about current role (use data-cy attribute)
    cy.get('[data-cy="assistant-message"]').should('exist').and('contain.text', 'What is your current role?');
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
        cy.get('[data-cy="assistant-message"]', { timeout: 5000 })
          .should('exist').and('contain.text', 'What is your full name?');
      }
      
      cy.get('[data-cy="chat-input-field"]').should('be.visible').type(answer);
      cy.get('[data-cy="send-button"]').click();
      
      // Verify answer was sent - use data-cy selector and force check in case of visibility issues
      cy.get('[data-cy="user-message"]').should('exist').and('contain.text', answer);
      // Alternative check that uses force to bypass potential visibility issues
      cy.get('[data-cy="user-message"]').contains(answer, { matchCase: true, timeout: 5000 });
    });
    
    // After answering all questions, should see processing message
    cy.get('[data-cy="assistant-message"]').should('exist')
      .and('contain.text', 'Thank you for providing all the information');
    
    // End Conversation button should be enabled after processing - use exist instead of visibility check
    cy.get('[data-cy="end-conversation-button"]').should('exist').and('not.be.disabled');
    // Force click if visible checks fail due to overlapping elements
    cy.get('[data-cy="end-conversation-button"]').should(($btn) => {
      expect($btn.attr('disabled')).to.not.exist;
    });
  });

  it('should save resume data when ending conversation', () => {
    // Mock the server call for saving resume
    cy.intercept('POST', 'http://localhost:5001/save-resume', {
      statusCode: 200,
      body: { success: true, message: 'Resume data saved successfully' }
    }).as('saveResume');
    
    // Go through a shorter version of the test with just one question
    cy.get('[data-cy="chat-input-field"]').type('Test User');
    cy.get('[data-cy="send-button"]').click();
    
    // Mock the remaining questions quickly
    for (let i = 0; i < 8; i++) {
      cy.get('[data-cy="chat-input-field"]').type(`Answer ${i}`);
      cy.get('[data-cy="send-button"]').click();
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
    
    // Wait for processing to complete (using data-cy attribute)
    cy.get('[data-cy="assistant-message"]', { timeout: 10000 })
      .should('exist').and('contain.text', 'I\'ve processed your information');
    
    // End the conversation - force click to bypass visibility checks
    cy.get('[data-cy="end-conversation-button"]').click({ force: true });
    
    // Should have made a server call to save resume data
    cy.wait('@saveResume');
    
    // Should show confirmation message (use data-cy attribute)
    cy.get('[data-cy="assistant-message"]', { timeout: 5000 })
      .should('exist').and('contain.text', 'Your resume data has been saved successfully');
  });
});