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
            cy.log('QA Audit: Forzando apertura de calendario...');
            cy.get('[data-testid="searchbox-dates-container"]').click();
        }
    });
    cy.wait(500); 
    cy.selectDynamicDates();

    cy.get('form').invoke('removeAttr', 'target');
    cy.get(EL.searchBtn).contains('Search').click({ force: true });
    
    cy.wait('@searchResultsNet');

    cy.url().then(url => cy.log('🌐 URL actual:', url));
    cy.get('body').then(($body) => {
        cy.log('Título detectado:', $body.find('h1').first().text());
    });

    cy.screenshot('debug-search-results');

    cy.get('a[href*="hotel/"]', { timeout: 15000 })
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    cy.get('body').then(($body) => {
        if ($body.find(EL.roomSelect).length > 0) {
            cy.get(EL.roomSelect).first().select('1'); 
            cy.get(EL.reserveBtn).contains("I'll reserve").click({ force: true });
        }
    });

    cy.wait('@checkoutNet');
    cy.get(EL.fName).type('Stephen', { delay: 50 });
    cy.get(EL.lName).type('Reyes', { delay: 50 });
    cy.get(EL.email).type('stephen.qa@example.com');
    cy.get(EL.submitDetails).click({ force: true });

    cy.get(EL.completeBooking).click({ force: true });
    cy.wait('@finalPaymentMock');

    cy.get('h1', { timeout: 15000 }).should('contain', 'Your reservation is confirmed');
  });
});
