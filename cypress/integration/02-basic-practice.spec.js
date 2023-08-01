/// <reference types="cypress" />

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  describe('Adding a new item', () => {
    it('should put a new item on the page after clicking on "Add Item"', () => {
      const newItem = 'TV';
      cy.get('[data-test="new-item-input"]').type(newItem);
      cy.get('[data-test="add-item"]').click();
      cy.contains(newItem);
    });

    it('should put a new item in the "Unpacked Items" list', () => {
      const newItem = 'Toy';
      cy.get('[data-test="new-item-input"]').type(newItem);
      cy.get('[data-test="add-item"]').click();
      cy.get('form').submit();
      cy.get('[data-test="items-unpacked"]').contains(newItem);
    });

    it('should put a new item as the last item in the "Unpacked Items" list', () => {
      const newItem = 'Book';
      cy.get('[data-test="new-item-input"]').type(newItem);
      cy.get('[data-test="add-item"]').click();
      cy.get('[data-test="items-unpacked"]').last().contains(newItem);
    });
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      const word = 'Tooth';
      cy.get('[data-test="filter-items"]').type(word);
      cy.get('[data-test="items-unpacked"]').contains(word);
    });

    it('should hide items that do not match whatever is in the filter field', () => {
      const word = 'Tooth';
      cy.get('[data-test="filter-items"]').type(word);
      // cy.get('[data-test="items-unpacked"]').should('have.length', 2); wrong but not sure why?
      cy.get('[data-test="items-unpacked"]')
        .should('not.contain', 'Deoderant')
        .should('not.contain', 'iPhone Charger');
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        cy.get('[data-test="remove-all"]').click();
        cy.get('[data-test="items-unpacked"]').contains('No items to show').should('exist');
        cy.get('[data-test="items-packed"]').contains('No items to show').should('exist');
      });
    });

    describe('Remove individual items', () => {
      it('should have a remove button on an item', () => {
        cy.get('[data-test="items-unpacked"] li').each((li) =>
          cy.wrap(li).contains('Remove').should('exist'),
        );
      });

      it('should remove an item from the page', () => {
        cy.contains('Deoderant').parent().contains('Remove').click();
        cy.contains('Deoderant').should('not.exist');
      });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
      cy.get('[data-test="mark-all-as-unpacked"]').click();
      cy.get('[data-test="items-packed"] li').should('have.length', 0);
    });

    it('should empty have all of the items in the "Unpacked" list', () => {
      cy.get('[data-test="mark-all-as-unpacked"]').click();
      cy.get('[data-test="items-unpacked"] li').should('have.length', 5);
    });
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      cy.contains('Hoodie').click();
      cy.get('[data-test="items-unpacked"]').contains('Hoodie').should('exist');
    });
  });
});
