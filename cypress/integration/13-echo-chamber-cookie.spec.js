/// <reference types="cypress" />

import '../support/commands-complete';

const user = {
  email: 'first@example.com',
  password: 'password123',
};

//decoding and encoding fuction for jwt (payload)
export const decodeToken = (token) => JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
export const encodeToken = (token) => Buffer.from(JSON.stringify(token)).toString('base64');

describe('Signing in with a seeded database', () => {
  beforeEach(() => {
    cy.task('seed');
    cy.visit('/echo-chamber/sign-in');
    cy.signIn(user);
  });

  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('should set a cookie', () => {
    cy.getCookie('jwt').should('exist');
  });

  it('should set a cookie with correct value', () => {
    cy.getCookie('jwt').its('value').then(decodeToken).its('email').should('equal', user.email);
    // cy.getCookie('jwt')
    //   .then((cookie) => decodeToken(cookie.value))
    //   .its('email')
    //   .should('equal', user.email);
  });
});

describe('Setting the cookie', () => {
  beforeEach(() => {
    cy.task('seed');
    //setCookie(cookie's name, cookie's value, options)
    cy.setCookie('jwt', encodeToken({ id: 999, email: 'cypress@example.com' }));
    cy.visit('/echo-chamber/sign-in');
  });

  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('show that user on the page', () => {
    cy.contains('cypress@example.com');
  });
});

describe('Setting the cookie with real data', () => {
  beforeEach(() => {
    cy.task('seed');
    //cy.request() interacts with endpoint directly as opposed to "cy.intercept()" -- only to mock network request
    cy.request('/echo-chamber/api/users')
      .then((response) => {
        //extract the first user from the users array in the body of response
        const [user] = response.body.users;
        //set encoded user data as cookie named "jwt", use then call back to make user chainable
        cy.setCookie('jwt', encodeToken(user)).then(() => user);
      })
      .as('user');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('show that user on the page', () => {
    cy.get('@user').then((user) => {
      cy.contains(`Signed in as ${user.email}`);
    });
  });
});
