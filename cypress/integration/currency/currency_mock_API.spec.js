/// <reference types="cypress" />
import * as constants from "../../support/constants";

describe("testing currency toggle with mock API responses", () => {
  before(() => {
    cy.intercept("GET", constants.api.currency, {
      fixture: "currencies.json",
    }).as("get_currencies");

    cy.visit(constants.url.local);
  });
  beforeEach(() => {
    cy.intercept("GET", `${constants.api.local}/items?sort=0`).as(
      "get_items_descending"
    );
    cy.intercept("GET", `${constants.api.local}/items?sort=1`).as(
      "get_items_ascending"
    );
  });

  it("AC1 - use Mock exchange rate for MYR (USD-MYR=5) and check UI", () => {
    let item_price_USD;
    cy.get(".currency_selector").wait(1000).select("MYR");
    cy.wait("@get_items_descending")
      .then((resp) => {
        const resp_json = resp.response.body;
        item_price_USD = resp_json.items[0].price;
        return item_price_USD;
      })
      .then((item_price_USD) => {
        cy.get(".movements")
          .find(".movements__row")
          .get(".movements__value")
          .eq(0)
          .should("have.text", `${(10 * item_price_USD).toFixed(2)} MYR`);
      });
  });

  it("AC1 - use Mock exchange rate for SGD (USD-SGD=2) and check UI", () => {
    let item_price_USD;
    cy.get(".currency_selector").wait(1000).select("SGD");
    cy.wait("@get_items_descending")
      .then((resp) => {
        const resp_json = resp.response.body;
        item_price_USD = resp_json.items[0].price;
        return item_price_USD;
      })
      .then((item_price_USD) => {
        cy.get(".movements")
          .find(".movements__row")
          .get(".movements__value")
          .eq(0)
          .should("have.text", `${(2 * item_price_USD).toFixed(2)} SGD`);
      });
  });
});
