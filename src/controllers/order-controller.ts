import type { Invoice, Menu, PlaceOrderInput } from "../models/index.js";
import { processOrder } from "../services/index.js";

/** Public application contract shared by the CLI and web views. */
export interface OrderingController {
  getMenu(): Menu;
  processOrder(input: PlaceOrderInput): Invoice;
}

/**
 * Provides presentation layers with ordering use cases while keeping business
 * calculations behind the service boundary.
 */
export class RestaurantOrderController implements OrderingController {
  constructor(private readonly menu: Menu) {}

  getMenu(): Menu {
    return this.menu;
  }

  processOrder(input: PlaceOrderInput): Invoice {
    return processOrder(input, this.menu);
  }
}
