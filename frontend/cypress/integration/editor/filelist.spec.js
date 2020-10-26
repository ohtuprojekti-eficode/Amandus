describe('When visiting the file listing view, as a user', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3001/filelist')
  })

  it('I can open the file listing', function () {
    cy.contains('Files in the repository')
  })

  it('I can view the files', function () {
    cy.get('li').should('have.length', 4)
  })

  it('I can select a file by clicking it', function () {
    cy.contains('README.md').click()
    cy.contains('robot-test-files')
  })
})
