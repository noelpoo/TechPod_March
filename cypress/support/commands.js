Cypress.Commands.add("selectCurrency", (currency) => {
  cy.get(".currency_selector").wait(1000).select(currency);
});
