/// <reference types="cypress" />
import * as constants from "../support/constants";
import * as utils from "../support/utils";

describe("Home-page as a guest user", () => {
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
  });

  it("AC0 - as guest user, nav bar should contain welcome msg, login element and current date", () => {
    cy.get(".welcome").contains("Log in to add/delete items").should("exist");

    // INSPECTING LOGIN ELEMENTS
    cy.get(".login").find("input").should("have.length", 2);

    cy.get(".login")
      .find('input[type="text"]')
      .should("have.attr", "placeholder", "user");

    cy.get(".login")
      .find('input[type="password"]')
      .should("have.attr", "placeholder", "PIN")
      .should("have.attr", "maxlength", "4");

    //INSPECTING NAV BAR DATE ITEM
    cy.get(".balance__date").contains("As of").should("exist");
    const currentDate = utils.getCurrentDate();
    cy.get('span[class="date"]').should("have.text", currentDate);
  });

  it("AC1 - validate: order of items from API response is create_time desc order", () => {
    cy.reload();
    cy.wait("@get_items_descending")
      .then((resp) => {
        const resp_json = resp.response.body;
        const resp_items = resp_json.items;
        return resp_items;
      })
      .then((items) => {
        // VALIDATE THAT ITEM FROM API RESPONSE IS IN CREATE_TIME DESCENDING ORDER
        expect(utils.checkListOrder(items, "descending")).to.equal(true);
        return items;
      })
      .then((items) => {
        //   VERIFY THAT ORDER ON UI IS THE SAME AS API RESPONSE
        let correct_order = new Array();
        items.forEach((item) => {
          correct_order.push(item.name);
        });
        cy.get(".movements")
          .find(".movements__row")
          .each(($el, index) => {
            const itemName = $el.find(".movements__type").text();
            expect(itemName).to.equal(correct_order[index]);
          });
      });
  });

  it("AC2 - each item should consist of 3 elements, Name, Time and Price", () => {
    cy.get(".movements")
      .find(".movements__row")
      .each(($el) => {
        cy.get($el).find(".movements__type").should("exist");
        cy.get($el).find(".movements__time").should("exist");
        cy.get($el).find(".movements__value").should("exist");
      });
  });

  it("AC3 - the number of items received from API is same as the number of items on UI", () => {
    cy.reload();
    cy.wait("@get_items_descending")
      .then((resp) => {
        const resp_json = resp.response.body;
        const resp_items = resp_json.items;
        return resp_items.length;
      })
      .then((items_count) => {
        cy.get(".movements")
          .find(".movements__row")
          .should("have.length", items_count);
      });
  });

  it("AC4 - sort button calls API, validate that items in API response is in create_time asc, verify that UI order matches API response order", () => {
    cy.get("button")
      .contains("↓ SORT")
      .should("exist")
      .then((el) => {
        cy.get(el).click();
      });
    cy.wait("@get_items_ascending")
      .then((resp) => {
        const resp_json = resp.response.body;
        const resp_items = resp_json.items;
        return resp_items;
      })
      .then((items) => {
        expect(utils.checkListOrder(items, "ascending")).to.equal(true);
        return items;
      })
      .then((items) => {
        let correct_order = new Array();
        items.forEach((item) => {
          correct_order.push(item.name);
        });
        cy.get(".movements")
          .find(".movements__row")
          .each(($el, index) => {
            const itemName = $el.find(".movements__type").text();
            expect(itemName).to.equal(correct_order[index]);
          });
      });
  });
});
