/// <reference types="cypress" />

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');

    cy.get('#minimum-rating-visibility').as('rating-filter');
    cy.get('#restaurant-visibility-filter').as('restaurant-filter');
  });

  it('should set the range and verify it', () => {
    cy.get('@rating-filter').invoke('val', '5').trigger('input');
    cy.get('@rating-filter').should('have.value', '5');
  });

  it('should check the checkbox and verify it', () => {
    // cy.get('input[type="checkbox"]').then(($checkbox) => {
    //   cy.wrap($checkbox).check();
    //   cy.wrap($checkbox).should('be.checked');
    // });

    cy.get('input[type="checkbox"]').check().should('be.checked');

    // cy.get('input[type="checkbox"]').as('checkBox').check();
    // cy.get('@checkBox').should('be.checked');
  });

  it('should select an option from the select and verify it', () => {
    // cy.get('@restaurant-filter').select('KFC');
    // cy.get('@restaurant-filter').should('have.value', 'KFC');

    cy.get('@restaurant-filter').select('KFC').should('have.value', 'KFC');
  });
});
