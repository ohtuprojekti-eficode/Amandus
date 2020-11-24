import { v4 as uuid } from 'uuid'

describe('When visiting the edit view page, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST') + '/edit')
  })

  it('I will be asked to log in when I am not logged in', () => {
    cy.url().should('include', '/edit')
    cy.contains('Please log in!')
  })

  it('I can open the editor when I am logged in', () => {
    
    cy.visit(Cypress.env('HOST') + '/register')

    const randomStr = uuid()
    const username = randomStr.substr(0, 4)
    const email = `${username}@test.com`
    const password = 'testUserPass!111'

    cy.get('#username').type(username)  
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#confirmPassword').type(password)  
    cy.get('form button').click()

    cy.wait(1000)

    cy.visit(Cypress.env('HOST') + '/login')

    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('form button').click()
    
    cy.wait(1000)

    cy.visit(Cypress.env('HOST') + '/edit')
    
    // TODO: there has to be something on the page to test so we know user is logged in, i.e. class, id attribute or some content.
    
})

})
