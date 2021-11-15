describe('When visiting the connections page, as a user', () => {
  beforeEach(() => {
    cy.deleteUser('testuser')
    cy.createUserAndLogin('testuser', 'testuser@testus.er', 'Testi123!')
  })
  it('I can see title "Connections" when I am logged in', () => {
    cy.visit(Cypress.env('HOST') + '/connections')
    cy.contains('Connections')
  })
  it('After connecting with Github, I can see the Github button disabled', () => {
    cy.connectWith('github')
    cy.get('#githubAuthButton').should('be.disabled')
  })
  it('After connecting with Gitlab, I can see the Gitlab button disabled', () => {
    cy.connectWith('gitlab')
    cy.get('#gitlabAuthButton').should('be.disabled')
  })
  it('After connecting with Bitbucket, I can see the Bitbucket button disabled', () => {
    cy.connectWith('bitbucket')
    cy.get('#bitbucketAuthButton').should('be.disabled')
  })
  it('After connecting with every service, all of the buttons should be disabled', () => {
    cy.connectWith('github')
    cy.connectWith('gitlab')
    cy.connectWith('bitbucket')

    cy.get('#githubAuthButton').should('be.disabled')
    cy.get('#gitlabAuthButton').should('be.disabled')
    cy.get('#bitbucketAuthButton').should('be.disabled')
  })
})