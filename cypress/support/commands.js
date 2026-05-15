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
    const today = new Date();
    
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 7);
    
    const checkOut = new Date(today);
    checkOut.setDate(today.getDate() + 10);

    const startDate = checkIn.toISOString().split('T')[0];
    const endDate = checkOut.toISOString().split('T')[0];

    cy.log(`QA Audit - Seleccionando fechas dinámicas: ${startDate} hasta ${endDate}`);

    cy.get(`[data-date="${startDate}"]`).scrollIntoView().click({ force: true });
    cy.get(`[data-date="${endDate}"]`).scrollIntoView().click({ force: true });
});

Cypress.Commands.add('clearIntrusiveElements', () => {
    const popups = [
        'button[aria-label="Dismiss sign-in info."]',
        '#onetrust-accept-btn-handler',
        '.modal-content button.close'
    ];

    cy.get('body').then(($body) => {
        popups.forEach((selector) => {
            if ($body.find(selector).length > 0) {
                cy.get(selector).click({ force: true });
                cy.log(`QA Audit: Elemento ${selector} cerrado exitosamente.`);
            }
        });
    });
});
