import "./styles.css";

import { RestaurantOrderController } from "../../controllers/index.js";
import type { Menu } from "../../models/index.js";
import { initialiseWebView } from "./web-view.js";

async function loadMenu(): Promise<Menu> {
  const menuUrl = new URL("../../data/menu.json", import.meta.url);
  const response = await fetch(menuUrl);

  if (!response.ok) {
    throw new Error("The restaurant menu could not be loaded");
  }

  return (await response.json()) as Menu;
}

async function startApplication(): Promise<void> {
  const menu = await loadMenu();
  const controller = new RestaurantOrderController(menu);
  initialiseWebView(controller);
}

startApplication().catch((error: unknown) => {
  const errorElement = document.getElementById("startup-error");

  if (errorElement !== null) {
    errorElement.textContent = error instanceof Error ? error.message : "The application could not start";
    errorElement.classList.remove("hidden");
  }
});
