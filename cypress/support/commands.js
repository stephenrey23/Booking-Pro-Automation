import { EL } from './selectors';

Cypress.Commands.add('interceptStagingEnv', () => {
    cy.intercept('GET', '**/ads*', { body: {} }); 
    
    cy.intercept('POST', '**/graphql*', (req) => {
        if (JSON.stringify(req.body).includes('AutoComplete')) {
            req.reply({ fixture: 'autocomplete-ny.json' });
        }
    }).as('autocompleteNet');

    cy.intercept('GET', '**/searchresults*', { fixture: 'search-results-ny.json' }).as('searchResultsNet');

    cy.intercept('GET', '**/checkout*', { fixture: 'checkout-details.json' }).as('checkoutNet');

    cy.intercept('POST', '**/book.html*', { fixture: 'payment-success.json' }).as('finalPaymentMock');
});

Cypress.Commands.add('humanizedVisit', (path) => {
    const url = `https://www.booking.com${path}?lang=en-us&cc=us`;
    cy.visit(url, {
        onBeforeLoad: (win) => {
            Object.defineProperty(win.navigator, 'webdriver', { get: () => false });
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    });
});

Cypress.Commands.add('selectDynamicDates', () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    cy.get(`[data-date="${today}"]`).first().click({ force: true });
    cy.get(`[data-date="${tomorrowStr}"]`).first().click({ force: true });
});
