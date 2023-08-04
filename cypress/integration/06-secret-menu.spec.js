/// <reference types="cypress" />

const restaurants = [
  'Chick-fil-A',
  'McDonalds',
  'In-N-Out',
  'KFC',
  'Jack In The Box',
  'Jamba Juice',
  'Starbucks',
  'Dairy Queen',
  'Burger King',
  'Chipotle',
  'Taco Bell',
  'Five Guys',
  'Sonic',
  'Subway',
  'Panera Bread',
];

const properties = [
  'name',
  'whereToOrder',
  'description',
  'secret',
  'ingredients',
  'popularity',
  'price',
  'howToOrder',
];

const ratings = [1, 2, 3, 4, 5, 6, 7];

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
  });

  it('should have the title on the page', () => {
    cy.get('h1').should('contain', 'Secret Menu Items');
  });

  properties.forEach((property) => {
    it(`should have a ${property} checkbox`, () => {
      cy.get(`#show-${property}`).should('be.visible');
    });

    it(`should have a column for ${property}`, () => {
      cy.get(`#${property}-column`).should('be.visible');
    });

    it(`should hide the ${property} column if it is unchecked`, () => {
      cy.get(`#show-${property}`).click();
      cy.get(`#${property}-column`).should('not.be.visible');
    });
  });
});

describe.only('Restaurant dropdown', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
    cy.get('#restaurant-visibility-filter').as('restaurantFilter');
  });

  restaurants.forEach((restaurant) => {
    it(`should only show ${restaurant} in the "Where to Order" column when it's selected from the Resturant dropdown menu`, () => {
      cy.get('@restaurantFilter').select(restaurant);
      cy.get('.whereToOrder').should('contain', restaurant).and('have.length.at.least', 1);
    });
  });
});

describe('Customers rating', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
    cy.get('#minimum-rating-visibility').as('ratingFilter');
  });

  ratings.forEach((rating) => {
    it(`should only show items with the pupularity above ${rating}`, () => {
      cy.get('@ratingFilter').invoke('val', rating).trigger('input');
      // cy.get('.popularity').should('contain', rating);
      cy.get('td.popularity').each(($el) => {
        expect(+$el.text).to.be.greaterThan(rating);
      });
    });
  });
});
