/// <reference types="cypress" />

describe('Initial Page', () => {
  beforeEach(() => {
    cy.task('reset');
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
