import { EL } from './selectors';

Cypress.Commands.add('interceptStagingEnv', (customHtml = null) => {
    cy.intercept('GET', '**/ads*', { body: {} }); 
    
    cy.intercept('POST', '**/graphql*', (req) => {
        if (JSON.stringify(req.body).includes('AutoComplete')) {
            req.reply({ fixture: 'autocomplete-ny.json' });
        }
    }).as('autocompleteNet');

    cy.intercept('GET', '**/searchresults*', (req) => {
        const fallbackHtml = `
            <html>
                <body style="background: #f4f4f4; padding: 20px; font-family: sans-serif;">
                    <h1>Results for New York</h1>
                    <div style="border: 1px solid #ccc; padding: 15px; background: white;">
                        <a href="https://www.booking.com/checkout.html?hotel_id=999" id="mock-hotel-link" style="font-size: 20px; color: blue;">
                            Stephen Reyes Luxury Resort
                        </a>
                        <p>QA Verified Mock</p>
                    </div>
                </body>
            </html>`;

        req.reply({
            statusCode: 200,
            body: customHtml || fallbackHtml,
            headers: { 'content-type': 'text/html; charset=utf-8' }
        });
    }).as('searchResultsNet');

    cy.intercept('GET', '**/hotel/**', {
        statusCode: 200,
        body: '<html><body><a href="https://www.booking.com/checkout.html">Go to Checkout</a></body></html>'
    });

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
    cy.get('[data-testid="datepicker-tabs"]', { timeout: 10000 }).should('be.visible');
    cy.get(`[data-date="${startDate}"]`).first().click({ force: true });
    cy.get(`[data-date="${endDate}"]`).first().click({ force: true });
});

Cypress.Commands.add('clearIntrusiveElements', () => {
    const popups = ['button[aria-label="Dismiss sign-in info."]', '#onetrust-accept-btn-handler'];
    cy.get('body').then(($body) => {
        popups.forEach((selector) => {
            if ($body.find(selector).length > 0) cy.get(selector).click({ force: true });
        });
    });
});
