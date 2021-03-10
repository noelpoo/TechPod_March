/// <reference types="cypress" />
import * as constants from "../support/constants";
import * as utils from "../support/utils";

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

  it("select MYR", function () {
    cy.get(".currency_selector").wait(1000).select("SGD");
  });
});
