import { v4 as uuid } from 'uuid'

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

  it('I can log in to the app with valid credentials', () => {
    
    cy.visit(Cypress.env('HOST') + '/register')
    
    const randomStr = uuid()
    const username = randomStr.substr(0, 3)
    const email = `${username}@test.com`
    const password = 'testUserPass!111'

    cy.get('#username').type(username)  
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#confirmPassword').type(password)  
    cy.get('form button').click()

    cy.visit(Cypress.env('HOST') + '/login')

    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('form button').click()
    
    cy.contains(`${username} - logout`)
  })

})
