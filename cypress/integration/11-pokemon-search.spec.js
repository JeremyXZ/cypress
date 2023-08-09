/// <reference types="cypress" />

const pokemon = [
  { id: 1, name: 'Bumblesaur' },
  { id: 2, name: 'Charmer' },
  { id: 3, name: 'Turtle' },
];

//define getElement custom command:
Cypress.Commands.add('getEl', (selector) => {
  cy.get(`[data-test="${selector}"]`);
});

describe('Pokémon Search', () => {
  beforeEach(() => {
    cy.visit('/pokemon-search');

    cy.getEl('search').as('searchInput');
    cy.getEl('search-label').as('searchLabel');

    cy.intercept('/pokemon-search/api?*').as('api');
  });

  it('should call the API when the user types', () => {
    cy.get('@searchInput').type('Ivysaur');
    cy.wait('@api');
  });

  it('should update the query parameter', () => {
    cy.get('@searchInput').type('Ivy');
    cy.wait('@api');

    //checks for an exact match of the query string including "?"
    cy.location('search').should('equal', '?name=Ivy');
    //checks for the presence of a substring within the query string (there can be other substrings co-existing)
    cy.location('search').should('contain', 'name=Ivy');
  });

  //The interception object contains info about the intercepted request (e.g. method, URL, headers)
  //and response including statusCode, body, header.
  it('should make an Ajax request correcly (as expected)', () => {
    cy.get('@searchInput').type('Turtle');
    cy.wait('@api').then((interception) => {
      expect(interception.request.url).to.contain('name=Turtle');
    });
    // alternatively using .its() to access properties on the interception object and make assertions.
    // cy.wait('@api').its('request.url').should('contain', 'name=Turtle');
  });

  //qs means query string, checking the query parameter corresponding to the input field
  it('should pre-populate the search field with the query parameter', () => {
    cy.visit({ url: '/pokemon-search', qs: { name: 'char' } });
    cy.get('@searchInput').should('have.value', 'char');
  });

  it('should render the results to the page', () => {
    // intercepted (stub) a request with any query string ("*" after ?) in the url and sent the pokemon object (defined at top) as the response
    //so request didn't rearch the actual server
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    //no matter what the query string is (name="happy coding" as below), it won't affect the pokemon object being shown on the page
    //because the server didn't have the chance to handle the query string as the request was intercepted and responded with the mocked data "pokemon"
    cy.get('@searchInput').type('happy coding');

    cy.wait('@stubbed-api');

    cy.get('[data-test="result"]').should('have.length', 3);
    cy.get('[data-test="result"]').should('contain', 'Charmer');
  });

  it('should link to the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.get('@searchInput').type('anything');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el, index) => {
      const { id } = pokemon[index];
      cy.wrap($el).should('have.attr', 'href').and('contain', `/pokemon-search/${id}`);
    });
  });

  it('should persist the query parameter in the link to a pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    cy.get('@searchInput').type('happy');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el) => {
      cy.wrap($el).should('have.attr', 'href').and('contain', 'name=happy');
      // expect($el.attr('href')).to.contain('name=happy');
    });
  });

  //typing into the search field trigger api calls
  it('should check if typing into the search box and clicking links can trigger two separate api calls and can display expected results respectively', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.intercept('/pokemon-search/api/1', { fixture: 'bulbasaur.json' }).as('individual-api');

    cy.get('@searchInput').type('bulba');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').first().click();
    cy.wait('@individual-api');

    cy.location('pathname').should('contain', '/pokemon-search/1');
  });

  it('should make an api call with the correct query string if a user visits the page with a specific query parameter in it', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.visit({ url: '/pokemon-search', qs: { name: 'bulba' } });

    //check the response object's property ("url") inside the api call
    cy.wait('@stubbed-api').its('response.url').should('contain', '?name=bulba');
  });
});
