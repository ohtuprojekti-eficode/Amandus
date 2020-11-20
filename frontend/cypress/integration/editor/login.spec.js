describe('When visiting the application, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST'))
  })

  it('I can move to login page', () => {
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })
})
