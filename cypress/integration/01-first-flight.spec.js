/// <reference types="cypress" />

describe('Create a New Item', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });
  //cy.get will return a collection of specific element if the chained commands suggest its' a collection, eg. "should("have.length", 3)
  // it can return the first element of the collection if the chained commands suggest it's a single element, eg. ".click()", ".type()"
  it('should have a form', () => {
    cy.get('form').should('exist');
  });
  it('should have the word "Add Item', () => {
    cy.contains('Add Item');
  });

  it('should put stuff in the input field', () => {
    cy.get('[data-test="new-item-input"]').type('great stuff');
  });
});
