describe('When visiting the application, as a user', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('HOST'))
    })
  
    it('I can move to login page', () => {
      cy.contains('Login').click()
      cy.url().should('include', '/login')
      cy.contains('Login')
    })

    it('I can move to edit view page', () => {
        cy.contains('Edit view').click()
        cy.url().should('include', '/edit')
    })

    it('I can move to register page', () => {
        cy.contains('Register').click()
        cy.url().should('include', '/register')
        cy.contains('Register')
      })
})