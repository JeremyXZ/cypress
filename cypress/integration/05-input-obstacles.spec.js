/// <reference types="cypress" />

describe('Input obstacles', () => {
  beforeEach(() => {
    cy.visit('/obstacle-course');
  });

  it('should input text into the input field', () => {
    const newThought =
      '"Do the best you can until you know better. Then when you know better, do better."';

    cy.get('[data-test="text-input"]').type(newThought);
    cy.get('[data-test="text-result"]').contains(newThought);
  });

  it('should control a select input', () => {
    cy.get('[data-test="select-input"]').select('Hulk');
    cy.get('[data-test="select-result"]').contains('Hulk');
  });

  it('should find and control a checkbox input', () => {
    cy.get('[data-test="checkbox-onion"]').as('onion');
    cy.get('[data-test="checkbox-result"]').contains('(None)');
    cy.get('@onion').check();
    cy.get('[data-test="checkbox-result"]').contains('Onion');
    cy.get;
  });

  it('should find and control a radio input', () => {
    cy.get('[data-test="radio-john"]').as('john');
    cy.get('[data-test="radio-result"]').contains('Paul');
    cy.get('@john').check();
    cy.get('[data-test="radio-result"]').contains('John');
  });

  it('should find and control a color input', () => {
    cy.get('[data-test="color-input"]').as('colorInput');
    cy.get('[data-test="color-result"]').contains('#FF0000');
    cy.get('@colorInput').invoke('val', '#aabbee').trigger('input');
    cy.get('[data-test="color-result"]').contains('#aabbee');
  });

  it('should find and control a date input', () => {
    cy.get('[data-test="date-input"]').type('2023-08-03');
    cy.get('[data-test="date-result"]').contains('2023-08-03');
  });

  it('should find and control a range input', () => {
    cy.get('[data-test="range-input"]').invoke('val', '10').trigger('input');
    cy.get('[data-test="range-result"]').contains('10');
  });

  it('should find and control a file input', () => {
    cy.get('[data-test="file-input"]');
    cy.get('[data-test="file-result"]');
  });
});
