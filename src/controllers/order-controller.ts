import type { Invoice, PlaceOrderInput, Restaurant } from "../models/index.js";
import { processOrder } from "../services/index.js";

/** Public application contract shared by the CLI and web views. */
export interface OrderingController {
  getRestaurant(): Restaurant;
  processOrder(input: PlaceOrderInput): Invoice;
}

/**
 * Provides presentation layers with ordering use cases while keeping business
 * calculations and operational data behind the service boundary.
 */
export class RestaurantOrderController implements OrderingController {
  constructor(private readonly restaurant: Restaurant) {}

  getRestaurant(): Restaurant {
    return this.restaurant;
  }

  processOrder(input: PlaceOrderInput): Invoice {
    return processOrder(
      input,
      this.restaurant.menu,
      this.restaurant.tax.ratePercent,
    );
  }
}
