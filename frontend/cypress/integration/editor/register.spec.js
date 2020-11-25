import { v4 as uuid } from 'uuid'
  
describe('When visiting the register page, as a user', () => {
    
    beforeEach(() => {
      cy.visit(Cypress.env('HOST') + '/register')
    })
  
    it('I see an error message when I try to register with only username', () => {
      cy.get('#username').type('testuser')  
      cy.get('form button').click()
      cy.get('#email-helper-text').should('have.css', 'color', 'rgb(176, 0, 32)')
      cy.get('#password-helper-text').should('have.css', 'color', 'rgb(176, 0, 32)')
    })
  
    it('I see an error message when I try to register without password', () => {
        cy.get('#username').type('testuser')  
        cy.get('#email').type('testuser@test.com')  
        cy.get('form button').click()
        cy.get('#password-helper-text').should('have.css', 'color', 'rgb(176, 0, 32)')
    })

    it('I see an error message when I try to register without confirming password', () => {
        cy.get('#username').type('testuser')  
        cy.get('#email').type('testuser@test.com')
        cy.get('#password').type('testUserPass!111')  
        cy.get('form button').click()
        cy.get('#confirmPassword-helper-text').should('have.css', 'color', 'rgb(176, 0, 32)')
    })

    it('I can register to the app with valid information', () => {
        const randomStr = uuid()
        const username = randomStr.substr(0, 5)
        const email = `${username}@test.com`

        cy.get('#username').type(username)  
        cy.get('#email').type(email)
        cy.get('#password').type('testUserPass!111')
        cy.get('#confirmPassword').type('testUserPass!111')  
        cy.get('form button').click()
        cy.contains('Registered successfully.')
    })
    
})
  