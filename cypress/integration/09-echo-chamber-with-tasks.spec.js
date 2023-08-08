/// <reference types="cypress" />

// if just starting this file, neeed to run this command "npm run db:setup" to set up the database,
//so that cy.task can work (reset/seed the database)

// I've tried to change the user variable, it worked for the first two tasks, but not for the third and final task because seeding the database means
// populating  the database with preset data, which is the original user variable in this case.  So my modified user variable won't match
//the original user variable, hence failed.
// const user = {
//   email: `anyone@example.com`,
//   password: 'secret123',
// };

const user = {
  email: 'first@example.com',
  password: 'password123',
};

//emptying the database before doing the sign up and sign in should work
describe('Sign up and then sign in', () => {
  beforeEach(() => {
    cy.task('reset');
  });

  it('should successfully create a user and sign in when entering an email and a password', () => {
    // Sign Up
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').type(user.email);
    cy.get('[data-test="sign-up-password"]').type(user.password);
    cy.get('[data-test="sign-up-submit"]').click();

    // Sign In
    cy.visit('/echo-chamber/sign-in');
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });
});

//reseting the database will effectively remove the sign-up credentials created previously, so signing in with the orginal sign-up credentials failed

describe('Sign In without first signing up', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should not allow to sign in with an existing user', () => {
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    //instead of loggoing into this page: '/echo-chamber/posts', a user remained on the sign-in page and failed to sign in
    cy.location('pathname').should('contain', '/echo-chamber/sign-in');
    cy.contains('Signed in as ' + user.email).should('not.exist');
    cy.contains('No such user exists');
  });
});

//after seeding the database, existing users can directly sign in

describe('Sign In with existing user credentials', () => {
  beforeEach(() => {
    cy.task('seed');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should sign in with an existing user', () => {
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });
});

//an existing user should not be allowed to sign up again
describe('Sign up with existing user credentials', () => {
  beforeEach(() => {
    cy.task('seed');
    cy.visit('/echo-chamber/sign-up');
  });

  it('should not allow an existing user to  sign up again on Sign-up page', () => {
    cy.get('[data-test="sign-up-email"]').type(user.email);
    cy.get('[data-test="sign-up-password"]').type(user.password);
    cy.get('[data-test="sign-up-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/sign-up');
    cy.contains('A user already exists with that email.');
  });
});
