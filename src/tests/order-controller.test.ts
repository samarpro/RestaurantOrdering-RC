import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RestaurantOrderController } from "../controllers/index.js";
import { getRestaurant } from "../services/index.js";

const restaurant = getRestaurant();

describe("RestaurantOrderController", () => {
  const controller = new RestaurantOrderController(restaurant);

  it("exposes restaurant operations data", () => {
    assert.deepEqual(controller.getRestaurant(), restaurant);
  });

  it("processes an order using the restaurant GST configuration", () => {
    const invoice = controller.processOrder({
      items: [
        { productId: "cheeseburger", quantity: 2 },
        { productId: "large-soft-drink", quantity: 1 },
      ],
    });

    assert.equal(invoice.totalCents, 3_500);
    assert.equal(invoice.includedGstCents, 318);
  });
});
