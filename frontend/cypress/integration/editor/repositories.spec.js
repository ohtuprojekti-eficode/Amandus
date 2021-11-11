describe('When visiting the repositories page, as a user', () => {
  beforeEach(() => {
    cy.deleteUser('testuser')
    cy.createUserAndLogin('testuser', 'testuser@testus.er', 'Testi123!')
  })
  it('I can see appropriate message when I am logged in but not connected to any services', () => {
    cy.visit(Cypress.env('HOST') + '/repositories')
    cy.contains('error getting repos...User is not connected to any service')
  })
  it('I can see my Github repos after connecting with Github', () => {
    cy.visit(Cypress.env('HOST') + '/auth/github/callback?code=asdasdasd')
    cy.url().should('contain', '/connections')

    cy.visit(Cypress.env('HOST') + '/repositories')
    cy.contains('ghtestrepo1')
    cy.contains('ghtestrepo2')
  })
  it('I can see my Bitbucket repos after connecting with Bitbucket', () => {
    cy.visit(Cypress.env('HOST') + '/auth/bitbucket/callback?code=asdasdasd')
    cy.url().should('contain', '/connections')

    cy.visit(Cypress.env('HOST') + '/repositories')
    cy.contains('bbtestrepo1')
    cy.contains('bbtestrepo2')
  })
  it('I can see my Gitlab repos after connecting with Gitlab', () => {
    cy.visit(Cypress.env('HOST') + '/auth/gitlab/callback?code=asdasdasd')
    cy.url().should('contain', '/connections')

    cy.visit(Cypress.env('HOST') + '/repositories')
    cy.contains('gltestrepo1')
    cy.contains('gltestrepo2')
  })

  it('I can see all of my repos after connecting with every service', () => {
    cy.visit(Cypress.env('HOST') + '/auth/github/callback?code=asdasdasd')
    cy.url().should('contain', '/connections')

    cy.visit(Cypress.env('HOST') + '/auth/bitbucket/callback?code=asdasdasd')
    cy.url().should('contain', '/connections')

    cy.visit(Cypress.env('HOST') + '/auth/gitlab/callback?code=asdasdasd')
    cy.url().should('contain', '/connections')

    cy.visit(Cypress.env('HOST') + '/repositories')
    cy.contains('ghtestrepo1')
    cy.contains('ghtestrepo2')
    cy.contains('gltestrepo1')
    cy.contains('gltestrepo2')
    cy.contains('bbtestrepo1')
    cy.contains('bbtestrepo2')
  })
})