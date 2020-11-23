describe('When visiting the application, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST'))
  })

  it('I can move to edit view page', () => {
    cy.contains('Edit view').click()
    cy.url().should('include', '/edit')
  })
})

describe('When visiting the edit view page, as a user', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('HOST') + '/edit')
  })
})
