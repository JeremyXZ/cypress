/// <reference types="cypress" />

describe('Dog Facts', () => {
  beforeEach(() => {
    cy.visit('/dog-facts');

    cy.get('[data-test="fetch-button"]').as('fetchButton');
    cy.get('[data-test="clear-button"]').as('clearButton');
    cy.get('[data-test="amount-select"]').as('amountSelect');
    cy.get('[data-test="empty-state"]').as('emptyState');

    cy.intercept('/dog-facts/api?*').as('api');
  });

  it('should start out with an empty state', () => {
    cy.get('@emptyState').should('be.visible');
  });

  it('should no longer have an empty state after a fetch', () => {
    cy.get('@fetchButton').click();
    cy.should('not.contain', 'Fetch some dog facts or something.');
  });

  it('should make a request when the button is called', () => {
    cy.get('@fetchButton').click();
    cy.wait('@api');
    cy.get('#facts p').should('have.length', 3);
  });

  it('should adjust the amount when the select is changed', () => {
    cy.get('@amountSelect').select('7');
    cy.get('@fetchButton').click();
    cy.wait('@api').then((interception) => {
      cy.wrap(interception.request.url).should('contain', 'amount=7');
      // expect(interception.request.url).to.match(/\?amount=4$/);
    });
  });

  // cy.wait can be omitted since Cypress will have 4 seconds auto-wait by default (runing the query again and again until 4 seconds run out)
  //which is good for asynchronous operations
  it('should show the correct number of facts on the page', () => {
    cy.get('@amountSelect').select('5 Facts');
    cy.get('@fetchButton').click();
    cy.wait('@api');
    cy.get('#facts p').should('have.length', 5);
  });

  it('should clear the facts when the "Clear" button is pressed', () => {
    cy.get('@clearButton').click();
    cy.get('@emptyState').should('exist');
  });

  it.only("should reflect the number of facts we're looking for in the title", () => {
    cy.title().should('equal', '3 Dog Facts');
    cy.get('@amountSelect').select('10');
    cy.title().should('equal', '10 Dog Facts');
  });
});
