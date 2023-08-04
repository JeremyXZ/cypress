/// <reference types="cypress" />

describe('Initial Page', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber');
  });

  //target the specific element (title) using the attribute selector
  it('should have the title of the application in the header', () => {
    cy.get('[data-test="application-title"]').should('contain', 'Echo Chamber');
  });

  //use object property (title) to get title element
  it('should have the title of the application in the window', () => {
    cy.title().should('contain', 'Echo Chamber');
  });

  it('should navigate to "/sign-in" when you click the "Sign In" button', () => {
    cy.get('[data-test="sign-in"]').click();
    cy.location('pathname').should('contain', 'sign-in');
  });

  it('should navigate to "/sign-up" when you click the "Sign Up" button', () => {
    cy.get('[data-test="sign-up"]').click();
    cy.location('pathname').should('contain', 'sign-up');
  });
});

describe.only('Sign Up', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').as('emailInput');
  });

  it('should require an email', () => {
    cy.get('form').should('contain', 'Email Address');
    cy.get('@emailInput').should('be.visible');
  });

  it('should require that the email actually be an email address', () => {
    const invalidEmail = 'john.gmai.com';
    cy.get('@emailInput').type(invalidEmail);
    cy.on('window:alert', (str) => {
      expect(str).to.equal("is missing an '@'");
    });
  });

  it('should require a password when the email is present', () => {
    cy.get('@emailInput').type('example@gmail.com');
    cy.get('[data-test="sign-up-password"]').should('have.attr', 'required');
  });
});
