/// <reference types="cypress" />
import * as constants from "../../support/constants";

describe("Mock API setup in cypress for integration testing", () => {
  before(() => {
    // 1. Intercept exchange rate API response and stub it with a local response
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

  it("AC1 - use Mock exchange rate for MYR (USD-MYR = 5) and check UI", () => {
    // 2. Verify price shown in UI using mocked exchange rates.
    let item_price_USD;
    cy.selectCurrency("MYR");
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

  it("AC1 - use Mock exchange rate for SGD (USD-SGD = 2) and check UI", () => {
    let item_price_USD;
    cy.selectCurrency("SGD");
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

  it("AC1 - use Mock exchange rate for AUD (USD-AUD = 11) and check UI", () => {
    let item_price_USD;
    cy.selectCurrency("AUD");
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
          .should("have.text", `${(11 * item_price_USD).toFixed(2)} AUD`);
      });
  });
});
