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
  
  cy.wait(2000)
})

Cypress.Commands.add('deleteUser', (username) => {
  const query = `mutation {
    deleteUser(username:"${username}")
  }`

  cy.request({
    method: 'post',
    url: Cypress.env('GRAPHQL_URI'),
    body: { query },
    failOnStatusCode: false
  }).then((res) => {
    cy.log(res);
  })
  localStorage.clear()
  cy.wait(2000)
})