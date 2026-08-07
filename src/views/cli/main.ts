import { createRestaurantOrderController } from "../../controllers/index.js";
import { runCliView } from "./cli-view.js";

try {
  const controller = createRestaurantOrderController();
  await runCliView(controller);
} catch (error: unknown) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("\nOrder cancelled.");
  } else {
    console.error(error instanceof Error ? error.message : "The application could not start");
    process.exitCode = 1;
  }
}
