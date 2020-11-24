describe('When visiting the application, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST'))
  })

  it('I can move to login page', () => {
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    cy.contains('Login')
  })
})

describe('When visiting the login page, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST') + '/login')
  })

  it('I see an error message when I try to log in with invalid credentials', () => {
    cy.get('#username').type('testuser')
    cy.get('#password').type('TestPassword!111')
    cy.get('form button').click()
    cy.contains('Login failed. Please try again.')
  })

  it('I see a red message under the password field when I try to log in without a password', () => {
    cy.get('#username').type('testuser')
    cy.get('form button').click()
    cy.get('#password-helper-text').should('have.css', 'color', 'rgb(176, 0, 32)')
    cy.contains('Please enter your password.')
  })

  it('I see a red message under the username field when I try to log in without a username', () => {
    cy.get('#password').type('testuser')
    cy.get('form button').click()
    cy.get('#username-helper-text').should('have.css', 'color', 'rgb(176, 0, 32)')
    cy.contains('Please enter your username.')
  })
  
})
