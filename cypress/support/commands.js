import { EL } from './selectors';

Cypress.Commands.add('interceptStagingEnv', (customHtml = null) => {
    cy.intercept('GET', '**/ads*', { body: {} }); 
    
    cy.intercept('POST', '**/graphql*', (req) => {
        if (JSON.stringify(req.body).includes('AutoComplete')) {
            req.reply({ fixture: 'autocomplete-ny.json' });
        }
    }).as('autocompleteNet');

    cy.intercept('GET', '**/searchresults*', (req) => {
        const fallbackHtml = `<html><body><a href="https://www.booking.com/checkout.html">Stephen Resort</a></body></html>`;
        req.reply({ statusCode: 200, body: customHtml || fallbackHtml, headers: { 'content-type': 'text/html' } });
    }).as('searchResultsNet');

    cy.intercept('GET', '**/checkout*', (req) => {
        const checkoutHtml = `<html><body><form action="/final-step.html" method="POST">
            <input id="firstname"><input id="lastname"><input id="email">
            <button type="submit">Finalize</button></form></body></html>`;
        req.reply({ statusCode: 200, body: checkoutHtml, headers: { 'content-type': 'text/html' } });
    }).as('checkoutNet');

    cy.intercept('POST', '**/final-step.html*', {
        body: '<html><body><button>Complete booking</button></body></html>'
    });
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
    const today = new Date();
    const start = new Date(today); start.setDate(today.getDate() + 7);
    const end = new Date(today); end.setDate(today.getDate() + 10);
    const sDate = start.toISOString().split('T')[0];
    const eDate = end.toISOString().split('T')[0];
    cy.get(`[data-date="${sDate}"]`).first().click({ force: true });
    cy.get(`[data-date="${eDate}"]`).first().click({ force: true });
});

Cypress.Commands.add('clearIntrusiveElements', () => {
    cy.get('body').then(($body) => {
        if ($body.find('button[aria-label="Dismiss sign-in info."]').length > 0) {
            cy.get('button[aria-label="Dismiss sign-in info."]').click({ force: true });
        }
    });
});
