// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('createUserAndLogin', (username, email, password) => {
  const query = `mutation {
    register(
      username:"${username}",
      email:"${email}",
      password:"${password}"
    ) {
      accessToken,
      refreshToken
    }
  }`

  cy.request({
    method: 'post',
    url: Cypress.env('GRAPHQL_URI'),
    body: { query },
    failOnStatusCode: false
  }).then((res) => {
    cy.log(res);
    localStorage.setItem('amandus-user-access-token', res.body.data.register.accessToken)
    localStorage.setItem('amandus-user-refresh-token', res.body.data.register.accessToken)
  })
})

Cypress.Commands.add('resetUsers', () => {
  cy.request('POST', `${Cypress.env('BACKEND_URI')}/reset`)
})

Cypress.Commands.add('resetTokens', () => {
  cy.request('POST', `${Cypress.env('TOKENSERVICE_URI')}/reset`)
})

Cypress.Commands.add('connectWith', (service) => {
  let callbackUrl
  switch (service) {
    case 'github':
      callbackUrl = '/auth/github/callback?code=asdasdasd'
      break
    case 'gitlab':
      callbackUrl = '/auth/gitlab/callback?code=asdasdasd'
      break
    case 'bitbucket':
      callbackUrl = '/auth/bitbucket/callback?code=asdasdasd'
      break;
    default:
      throw new Error(`no such service: ${service}`)
  }

  cy.visit(Cypress.env('HOST') + callbackUrl)
  cy.url().should('contain', '/connections')
})