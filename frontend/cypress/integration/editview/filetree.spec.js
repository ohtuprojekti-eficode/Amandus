describe('When opening repository for editing', () => {
  beforeEach(() => {
    cy.deleteUser('testuser')
    cy.createUserAndLogin('testuser', 'testuser@testus.er', 'Testi123!')
    cy.resetRepoState()
    cy.openRepositoryToEditor()
  })

  it('I am able to see filedrawer', () => {
    cy.url().should('contain', '/edit')
    cy.get('.MuiTreeItem-content').should('contain', 'testuser')
  })

  it('I am able to open folders', () => {
    cy.url().should('contain', '/edit')
    cy.get('.MuiTreeItem-content').should('contain', 'testuser')
    cy.clickFileDrawerOn('testuser')
    cy.clickFileDrawerOn('e2e')
    cy.clickFileDrawerOn('robots')

    cy.get('.MuiTreeView-root').should('contain', 'README.md')
    cy.get('.MuiTreeView-root').should('contain', 'example-loop.robot')
    cy.get('.MuiTreeView-root').should('contain', 'resource.robot')
  })

  it('I am able to open file', () => {
    cy.url().should('contain', '/edit')
    cy.get('.MuiTreeItem-content').should('contain', 'testuser')
    cy.clickFileDrawerOn('testuser')
    cy.clickFileDrawerOn('e2e')
    cy.clickFileDrawerOn('README.md')

    cy.url().should('contain', 'testuser/github/testuser/e2etest/README.md')
    cy.editorShouldContainLine('This is a README.md')
  })
})
