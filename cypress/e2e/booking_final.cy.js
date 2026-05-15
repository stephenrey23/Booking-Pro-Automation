import { EL } from '../support/selectors';

describe('JIRA ID: BOOK-101 - Stephen Reyes End-to-End Happy Path', () => {
  
  beforeEach(() => {
    cy.interceptStagingEnv();
    cy.humanizedVisit('/index.html');
  });

  it('Execute Full Flow: Search -> Dates -> No Blank -> Mocked Payment', () => {
    cy.get(EL.destInput).type('New York', { force: true });
    cy.wait('@autocompleteNet');
    cy.get('ul li').first().click();

    cy.selectDynamicDates();

    cy.get('form').invoke('removeAttr', 'target');

    cy.get(EL.searchBtn).contains('Search').click();
    cy.wait('@searchResultsNet');
    
    cy.get(EL.hotelCard).first().find(EL.availabilityBtn).click({ force: true });

    cy.get('body').then(($body) => {
        if ($body.find(EL.roomSelect).length > 0) {
            cy.get(EL.roomSelect).first().select('1'); // Dropdown
            cy.get(EL.reserveBtn).contains("I'll reserve").click();
        }
    });

    cy.wait('@checkoutNet');
    cy.get(EL.fName).type('Stephen', { delay: 50 });
    cy.get(EL.lName).type('Reyes', { delay: 50 });
    cy.get(EL.email).type('stephen.qa@example.com');
    cy.get(EL.submitDetails).click();

    cy.get(EL.completeBooking).click();
    cy.wait('@finalPaymentMock');

    cy.get('h1').should('contain', 'Your reservation is confirmed');
    cy.get('h1', { timeout: 15000 }).should('contain', 'Your reservation is confirmed');
  });
});
