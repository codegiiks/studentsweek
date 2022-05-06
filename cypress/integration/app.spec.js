/* eslint-disable */
const GREETING_MESSAGES = ['Ciao', 'Hello', 'Hola', 'Salut', 'Hallo', 'Olà'];

describe('Greeting', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display a greeting message', () => {
        cy.getTestElement('greeting').contains('Ciao').should('be.visible');
    });

    it('should change the greeting message when clicking on the button', () => {
        for (const greeting of GREETING_MESSAGES) {
            cy.getTestElement('greeting').should(($el) => {
                expect($el).to.contain(greeting);
            });

            cy.getTestElement('change-greeting-button')
                .should('be.visible')
                .click();
        }
    });
});
