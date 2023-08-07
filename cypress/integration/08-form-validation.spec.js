/// <reference types="cypress" />

describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').as('emailInput');
    cy.get('[data-test="sign-up-submit"]').as('submitBtn');
  });

  it('should require an email', () => {
    cy.get('@submitBtn').click();
    cy.get('[data-test="sign-up-email"]:invalid')
      .invoke('prop', 'validationMessage')
      .should('contain', 'Please fill in this field.');
  });
  it('should require a password after filling out an email address and clicking Submit button', () => {
    cy.get('@emailInput').type('example@gmail.com');
    cy.get('@submitBtn').click();
    cy.get('[data-test="sign-up-password"]:invalid')
      .invoke('prop', 'validity')
      .its('valueMissing')
      .should('be.true');
  });

  it('should require that the email address is a valid one including "@"', () => {
    cy.get('@emailInput').type('myEmail.gmail.com');

    cy.get('@submitBtn').click();
    cy.get('[data-test="sign-up-email"]:invalid').should('have.length', 1);

    cy.get('@emailInput')
      .invoke('prop', 'validationMessage')
      .should('contain', "Please include an '@' in the email address.");

    cy.get('[data-test="sign-up-email"]:invalid')
      .invoke('prop', 'validity')
      .its('typeMismatch')
      .should('be.true');
  });
});
