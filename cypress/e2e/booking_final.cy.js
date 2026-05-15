import { EL } from '../support/selectors';

describe('JIRA ID: BOOK-101 - Stephen Reyes End-to-End Happy Path', () => {
  
  beforeEach(() => {
    cy.viewport(1280, 720); 
    cy.interceptStagingEnv(); 
    cy.humanizedVisit('/index.html');
    cy.clearIntrusiveElements();
  });

  it('Execute Full Flow: Search -> Dates -> No Blank -> Mocked Payment', () => {
    cy.wait(1500); 
    cy.clearIntrusiveElements(); 

    cy.get(EL.destInput).type('New York', { delay: 100, force: true });
    cy.wait('@autocompleteNet');
    cy.get('ul li').first().click({ force: true });

    cy.get('body').then(($body) => {
        if ($body.find('[data-testid="datepicker-tabs"]').length === 0) {
            cy.get('[data-testid="searchbox-dates-container"]').click();
        }
    });
    cy.wait(500); 
    cy.selectDynamicDates();

    cy.get('form').invoke('removeAttr', 'target');
    cy.get(EL.searchBtn).contains('Search').click({ force: true });
    
    cy.wait('@searchResultsNet');

    cy.get('a').filter('[href*="checkout"]').first().click({ force: true });
    cy.wait('@checkoutNet', { timeout: 20000 });

    cy.get('input#firstname').type('Stephen', { force: true });
    cy.get('input#lastname').type('Reyes', { force: true });
    cy.get('input#email').type('stephen.qa@example.com', { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.contains('button', 'Complete booking', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });

    cy.get('h1', { timeout: 15000 }).should('contain', 'Your reservation is confirmed');
  });
});
