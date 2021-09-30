import { v4 as uuid } from 'uuid'

describe('When deleting user', () => {
  
  it('I can delete my user account', () => {
    
    cy.visit(Cypress.env('HOST') + '/register')
    
    const randomStr = uuid()
    const username = randomStr.substr(0, 5)
    const email = `${username}@test.com`
    const password = 'testUserPass!111'

    cy.get('#username').type(username)  
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#confirmPassword').type(password)  
    cy.get('form button').click()

    cy.contains(`Delete Account`)
    cy.visit(Cypress.env('HOST') + '/deleteAccount')

    cy.wait(1000)
    cy.get(`#delete-button`).click()    
    cy.wait(1000)

    cy.contains(`Register`)
    cy.contains(`Login`)
  })
})
