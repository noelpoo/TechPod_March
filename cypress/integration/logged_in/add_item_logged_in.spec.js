/// <reference types="cypress" />
import * as constants from "../../support/constants";
import * as utils from "../../support/utils";

describe("logged in with valid and invalid user, verify add item element for valid user", () => {
  before(() => {
    cy.visit(constants.url.local);
  });

  beforeEach(() => {
    cy.intercept("POST", `${constants.api.local}/item`).as("add_item");
    cy.intercept("POST", `${constants.api.local}/login`).as("login");
  });

  //THIS
  it("login with invalid credentials should return 401 and error message from API", () => {
    cy.reload();
    cy.get(".login")
      .find('input[type="text"]')
      .type(constants.user.invalid.username);

    cy.get(".login")
      .find('input[type="password"]')
      .type(constants.user.invalid.password);

    cy.get('button[class="login__btn"]').contains("→").click();
    cy.wait("@login").then((resp) => {
      const resp_status = resp.response.statusCode;
      const resp_msg = resp.response.body;
      expect(resp_status).to.equal(401);
      expect(resp_msg.message).to.equal("invalid credentials");
    });
  });

  it("login with valid credentials", () => {
    cy.reload();
    cy.get(".login")
      .find('input[type="text"]')
      .type(constants.user.valid.username);

    cy.get(".login")
      .find('input[type="password"]')
      .type(constants.user.valid.password);

    cy.get('button[class="login__btn"]').contains("→").click();
    cy.wait("@login").then((resp) => {
      const resp_status = resp.response.statusCode;
      expect(resp_status).to.equal(200);
    });
  });

  it('inspect "add item" and "delete item" element is correct after valid login', () => {
    cy.get(".operation.operation--add").contains("Add Item").should("exist");
    cy.get(".operation.operation--delete")
      .contains("Delete Item")
      .should("exist");
  });

  // THIS
  it("add item with a random name and random price, validate that API POST response matches inputs", () => {
    const randomItemName = utils.generateRandomItemName(5);
    const randomItemPrice = String(utils.generateRandomPrice());
    cy.get(".operation.operation--add")
      .find('input[type="text"]')
      .type(randomItemName);

    cy.get(".operation.operation--add")
      .find('input[type="number"]')
      .type(randomItemPrice);

    cy.get(".operation.operation--add").contains("→").click();
    cy.wait("@add_item")
      .then((resp) => {
        const resp_json = resp.response.body;
        return resp_json;
      })
      .then((resp_json) => {
        expect(resp_json.name).to.equal(randomItemName);
        expect(String(resp_json.price)).to.equal(randomItemPrice);
      });
  });
});
