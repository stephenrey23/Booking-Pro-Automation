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
                        <a href="https://www.booking.com/checkout.html?hotel_id=999" id="mock-hotel-link" style="font-size: 20px; color: blue; font-weight: bold;">
                            Stephen Reyes Luxury Resort
                        </a>
                        <p>QA Verified Mock Hotel</p>
                    </div>
                </body>
            </html>`;
        req.reply({
            statusCode: 200,
            body: customHtml || fallbackHtml,
            headers: { 'content-type': 'text/html; charset=utf-8' }
        });
    }).as('searchResultsNet');

    cy.intercept('GET', '**/checkout*', (req) => {
        const checkoutHtml = `
            <html>
                <body style="padding: 50px; font-family: sans-serif;">
                    <h1>Confirm your booking</h1>
                    <form action="https://www.booking.com/final-step.html" method="POST">
                        <input id="firstname" name="firstname" type="text">
                        <input id="lastname" name="lastname" type="text">
                        <input id="email" name="email" type="email">
                        <button type="submit">Finalize Booking</button>
                    </form>
                </body>
            </html>`;
        req.reply({ statusCode: 200, body: checkoutHtml, headers: { 'content-type': 'text/html; charset=utf-8' } });
    }).as('checkoutNet');

    cy.intercept('POST', '**/final-step.html*', (req) => {
        const finalHtml = `
            <html>
                <body>
                    <h1>Review your stay</h1>
                    <button id="complete-btn">Complete booking</button>
                </body>
            </html>`;
        req.reply({ statusCode: 200, body: finalHtml, headers: { 'content-type': 'text/html; charset=utf-8' } });
    }).as('preFinalStep');

    cy.intercept('GET', '**/confirmation*', {
        statusCode: 200,
        body: '<html><body><h1>Your reservation is confirmed</h1></body></html>'
    }).as('finalPaymentMock');
});

