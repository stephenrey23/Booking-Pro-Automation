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
    cy.screenshot('debug-search-results');

    cy.get('a', { timeout: 15000 })
      .filter('[href*="checkout"], [href*="hotel/"]')
      .first()
      .click({ force: true });

    cy.wait('@checkoutNet', { timeout: 20000 });

    cy.get('input#firstname, input[name*="firstname"], input[placeholder*="First"]', { timeout: 15000 })
      .should('be.visible')
      .type('Stephen', { delay: 50, force: true });

    cy.get('input#lastname, input[name*="lastname"], input[placeholder*="Last"]')
      .should('be.visible')
      .type('Reyes', { delay: 50, force: true });

    cy.get('input#email, input[name*="email"]')
      .should('be.visible')
      .type('stephen.qa@example.com', { force: true });

    cy.get('button[type="submit"], .bui-button__arrow, [name="book"]').first().click({ force: true });

    cy.get(EL.completeBooking, { timeout: 10000 }).click({ force: true });
    cy.wait('@finalPaymentMock');

    cy.get('h1', { timeout: 15000 }).should('contain', 'Your reservation is confirmed');
  });
});
