/// <reference types="cypress" />

//use "Cypress.Commands.add()" to create a custom command and add it to the "cy" object.
//it bundles sequences of commands into one

const user = {
  email: 'first@example.com',
  password: 'password123',
};

//define a custom "getData" comand
Cypress.Commands.add('getEl', (attribute) => {
  return cy.get(`[data-test = "${attribute}"]`);
});

//define a custom "Sign up" command:
Cypress.Commands.add('signUp', (user) => {
  cy.visit('/echo-chamber/sign-up');
  cy.getEl('sign-up-email').type(user.email);
  cy.getEl('sign-up-password').type(user.password);
  cy.getEl('sign-up-submit').click();
});

// define a custom "signIn" command
Cypress.Commands.add('signIn', (user) => {
  cy.visit('/echo-chamber/sign-in');
  cy.getEl('sign-in-email').type(user.email);
  cy.getEl('sign-in-password').type(user.password);
  cy.getEl('sign-in-submit').click();
});

//so the old code can be simplified to this new one:

describe('Sign up and then sign in', () => {
  beforeEach(() => {
    cy.task('reset');
  });

  it('should successfully create a user and sign in when entering an email and a password', () => {
    //Sign up
    cy.signUp(user);
    //Sign in
    cy.signIn(user);

    //assertions
    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });
});

//Old code
// describe('Sign Up', () => {
//   beforeEach(() => {
//     cy.task('reset');
//   });

//   it('should successfully create a user and sign in when entering an email and a password', () => {
//     // Sign Up
//     cy.visit('/echo-chamber/sign-up');
//     cy.get('[data-test="sign-up-email"]').type(user.email);
//     cy.get('[data-test="sign-up-password"]').type(user.password);
//     cy.get('[data-test="sign-up-submit"]').click();

//     // Sign In
//     cy.visit('/echo-chamber/sign-in');
//     cy.get('[data-test="sign-in-email"]').type(user.email);
//     cy.get('[data-test="sign-in-password"]').type(user.password);
//     cy.get('[data-test="sign-in-submit"]').click();

//     cy.location('pathname').should('contain', '/echo-chamber/posts');
//     cy.contains('Signed in as ' + user.email);
//   });
// });
