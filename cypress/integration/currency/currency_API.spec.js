/// <reference types="cypress" />
import * as constants from "../../support/constants";

describe("USER STORY 2 - as guest user, testing currency selection", () => {
  before(() => {
    cy.visit(constants.url.local);
  });

  beforeEach(() => {
    cy.intercept("GET", `${constants.api.local}/items?sort=0`).as(
      "get_items_descending"
    );
    cy.intercept("GET", `${constants.api.local}/items?sort=1`).as(
      "get_items_ascending"
    );
    cy.intercept("POST", `${constants.api.local}/item`).as("add_item");
    cy.intercept("POST", `${constants.api.local}/login`).as("login");
    cy.intercept("GET", constants.api.currency).as("get_currency");
  });

  it("by default, currency should be in USD", () => {
    cy.get(".currency_selector_label")
      .contains("select currency")
      .should("exist");
    cy.get(".currency_selector").should("have.value", "USD");
  });

  it("AC1 - select MYR as currency, prices should be converted and displayed as MYR", () => {
    cy.reload();
    let MYR_rate;
    let item_price_USD;
    cy.wait("@get_currency").then((resp) => {
      const resp_json = resp.response.body;
      MYR_rate = resp_json.rates.MYR;
    });

    cy.reload();
    cy.wait("@get_items_descending")
      .then((resp) => {
        const resp_json = resp.response.body;
        item_price_USD = resp_json.items[0].price;
      })
      .then(() => {
        //  VERIFY - currency symbol is in MYR, if MYR is selected
        //  VALIDATE - “Price” value of item displayed should be price(USD) * exchange rate

        cy.selectCurrency("MYR").should("have.value", "MYR");

        cy.get(".movements")
          .find(".movements__row")
          .get(".movements__value")
          .eq(0)
          .should("have.text", `${(item_price_USD * MYR_rate).toFixed(2)} MYR`);
      });
  });
});
