import { loadMenu } from "../data/load-menu.js";
import { RestaurantOrderController } from "./order-controller.js";

export async function createRestaurantOrderController(): Promise<RestaurantOrderController> {
  const menu = await loadMenu();
  return new RestaurantOrderController(menu);
}
