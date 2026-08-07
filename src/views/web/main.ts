import "./styles.css";

import { createRestaurantOrderController } from "../../controllers/index.js";
import { initialiseWebView } from "./web-view.js";

async function startApplication(): Promise<void> {
  const controller = await createRestaurantOrderController();
  initialiseWebView(controller);
}

startApplication().catch((error: unknown) => {
  const errorElement = document.getElementById("startup-error");

  if (errorElement !== null) {
    errorElement.textContent = error instanceof Error ? error.message : "The application could not start";
    errorElement.classList.remove("hidden");
  }
});
