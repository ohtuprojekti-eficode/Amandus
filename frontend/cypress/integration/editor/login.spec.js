describe('When visiting the application, as a user', function () {
  beforeEach(function () {
    cy.visit(Cypress.env('HOST'))
  })

  it('I can move to login page', function () {
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })
})

describe('When visiting the login page, as a user', function () {
  beforeEach(function () {
    cy.visit(Cypress.env('HOST') + '/login')
  })

  it('I can see the github login button', function () {
    cy.url().should('include', '/login')
    cy.contains('Login with GitHub')
  })
})
