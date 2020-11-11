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

  it('I can view the file listing', () => {
    cy.contains('new_folder')
  })

  it('I can open a file in editor', () => {
    cy.contains('example.txt').click()
    cy.get('h2').contains('example.txt')
  })

  it('I can edit a file in editor and see a save button', () => {
    cy.contains('example.txt').click()
    cy.contains('Save')
  })
})
