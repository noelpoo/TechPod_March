/// <reference types="cypress" />
import * as constants from "../../support/constants";
import * as utils from "../../support/utils";

describe("testing currency selection", () => {
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

  it("AC1 - currency selection UI, by default, currency should be in USD", () => {
    cy.get(".currency_selector_label")
      .contains("select currency")
      .should("exist");
    cy.get(".currency_selector").should("have.value", "USD");
  });

  it("AC2 - select MYR as currency, and check that the conversion is correct based on real API exchange rates", () => {
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
        cy.get("select")
          .wait(1000)
          .select("MYR", { force: true })
          .should("have.value", "MYR");

        cy.get(".movements")
          .find(".movements__row")
          .get(".movements__value")
          .eq(0)
          .should("have.text", `${(item_price_USD * MYR_rate).toFixed(2)} MYR`);
      });
  });
});
