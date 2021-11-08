describe('When visiting the connections page, as a user', () => {
  beforeEach(() => {
    cy.deleteUser('testuser')
    cy.createUserAndLogin('testuser', 'testuser@testus.er', 'Testi123!')
  })
  it('I can see title "connections" when I am logged in', () => {
    cy.visit(Cypress.env('HOST') + '/connections')
    cy.contains('Connections')
  })
  it('After connecting with Github, I can see the Github button disabled', () => {
    cy.visit(Cypress.env('HOST') + '/auth/github/callback?code=asdasdasd')
    cy.get('#githubAuthButton').should('be.disabled')
  })
  it('After connecting with Gitlab, I can see the Gitlab button disabled', () => {
    cy.visit(Cypress.env('HOST') + '/auth/gitlab/callback?code=asdasdasd')
    cy.get('#gitlabAuthButton').should('be.disabled')
  })
  it('After connecting with Bitbucket, I can see the Bitbucket button disabled', () => {
    cy.visit(Cypress.env('HOST') + '/auth/bitbucket/callback?code=asdasdasd')
    cy.get('#bitbucketAuthButton').should('be.disabled')
  })
  it('After connecting with every service, all of the buttons should be disabled', () => {
    cy.visit(Cypress.env('HOST') + '/auth/github/callback?code=asdasdasd')
    cy.visit(Cypress.env('HOST') + '/auth/gitlab/callback?code=asdasdasd')
    cy.visit(Cypress.env('HOST') + '/auth/bitbucket/callback?code=asdasdasd')
    cy.get('#githubAuthButton').should('be.disabled')
    cy.get('#gitlabAuthButton').should('be.disabled')
    cy.get('#bitbucketAuthButton').should('be.disabled')
  })

  afterEach(() => {
    cy.deleteUser('testuser')
  })
})