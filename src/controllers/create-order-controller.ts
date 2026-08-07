import { getRestaurant } from "../services/index.js";
import { RestaurantOrderController } from "./order-controller.js";

export function createRestaurantOrderController(): RestaurantOrderController {
  return new RestaurantOrderController(getRestaurant());
}
