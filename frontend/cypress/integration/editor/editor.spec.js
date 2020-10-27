describe('When visiting the application, as a user', function () {
  beforeEach(function () {
    cy.visit(Cypress.env('HOST'))
  })

  it('I can move to edit view page', function () {
    cy.contains('Edit view').click()
    cy.url().should('include', '/edit')
  })
})

describe('When visiting the edit view page, as a user', function () {
  beforeEach(function () {
    cy.visit(Cypress.env('HOST') + '/edit')
  })

  it('I can view the file listing', function () {
    cy.contains('Files in the repository')
  })

  it('I can open a file in editor', function () {
    cy.contains('example.txt').click()
    cy.contains('ohtuprojekti-eficode/robot-test-files/example.txt')
  })

  it('I can edit a file in editor and see a save button', function () {
    cy.contains('example.txt').click()
    cy.contains('Save')
  })
})
