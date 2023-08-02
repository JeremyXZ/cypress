/// <reference types="cypress" />

//Practising using aliases

describe('Testing Jetsetter with aliases', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
    cy.get('[data-test="items-unpacked"]').as('unpackedItems');
    cy.get('[data-test="items-packed"]').as('packedItems');
  });

  describe('Adding a new item', () => {
    beforeEach(() => {
      cy.get('[data-test="new-item-input"]').as('inputItem');
      cy.get('[data-test="add-item"]').as('addItemBtn');
      cy.get('[data-test="filter-items"]').as('filterItems');
    });
    it('should add a new item on the page after clicking on the "Add Item"', () => {
      const newItem = 'TV';
      cy.get('@inputItem').type(newItem);
      cy.get('@addItemBtn').click();
      cy.contains(newItem);
    });

    it('should put a new item in the "Unpacked Items" list', () => {
      const newItem = 'Toy';
      cy.get('@inputItem').type(newItem);
      cy.get('@addItemBtn').click();
      cy.get('@unpackedItems').contains(newItem);
    });

    it('should put a new item as the last item in the "Unpacked Items" list', () => {
      const newItem = 'Book';
      cy.get('@inputItem').type(newItem);
      cy.get('@addItemBtn').click();
      cy.get('@unpackedItems').last().contains(newItem);
    });
  });

  describe('Removing a item from the "Packed Items" list', () => {
    beforeEach(() => {
      cy.get('@packedItems').first().contains('Removed').click();
      cy.get('@packItems').should('not.contain', 'Hoodie');
    });
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      cy.get('@unpackedItems').contains('Tooth Paste').click();
      cy.get('@packedItems').contains('Tooth Paste').should('exist');
    });
  });
});
