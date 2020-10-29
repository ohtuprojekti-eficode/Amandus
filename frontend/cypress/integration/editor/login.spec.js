describe('When visiting the application, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST'))
  })

  it('I can move to login page', () => {
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })
})

describe('When visiting the login page, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST') + '/login')
  })

  it('I can see the github login button', () => {
    cy.url().should('include', '/login')
    cy.contains('Login with GitHub')
  })
})
