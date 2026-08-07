import { checkbox, confirm, number as numberPrompt } from "@inquirer/prompts";

import type { OrderingController } from "../../controllers/index.js";
import type { PlaceOrderInput, Product, Restaurant } from "../../models/index.js";
import { formatCurrency } from "../shared/currency.js";
import { buildMenuTable, buildReceiptTable } from "./table-formatters.js";

function printHeader(restaurant: Restaurant): void {
  console.log(`\n🍽️  ${restaurant.name}`);
  console.log(`${restaurant.menu.name} — prices include ${restaurant.tax.ratePercent}% ${restaurant.tax.name}\n`);
}

function printMenu(restaurant: Restaurant): void {
  console.log("MENU");
  console.table(buildMenuTable(restaurant));
}

function categoryIcon(product: Product, restaurant: Restaurant): string {
  return restaurant.menu.categories.find((category) => category.id === product.category)?.icon ?? "•";
}

async function collectOrder(restaurant: Restaurant): Promise<PlaceOrderInput> {
  const selectedProductIds = await checkbox({
    message: "Select products to add (space to select, enter to continue)",
    required: true,
    choices: restaurant.menu.products.map((product) => ({
      name: `${categoryIcon(product, restaurant)} ${product.name} — ${formatCurrency(product.unitPriceCents)}`,
      value: product.id,
    })),
  });

  const items = [];

  for (const productId of selectedProductIds) {
    const product = restaurant.menu.products.find((item) => item.id === productId);

    if (product === undefined) {
      throw new Error(`Product "${productId}" is no longer available`);
    }

    const quantity = await numberPrompt({
      message: `How many ${product.name}?`,
      default: 1,
      min: 1,
      step: 1,
      required: true,
      validate: (value) => Number.isInteger(value) || "Quantity must be a whole number",
    });

    items.push({ productId, quantity });
  }

  return { items };
}

function printReceipt(controller: OrderingController, input: PlaceOrderInput): void {
  const restaurant = controller.getRestaurant();
  const invoice = controller.processOrder(input);

  console.log("\nRECEIPT");
  console.table(buildReceiptTable(invoice));
  console.log(`Total: ${formatCurrency(invoice.totalCents)}`);
  console.log(
    `Including ${restaurant.tax.name} (${restaurant.tax.ratePercent}%): ${formatCurrency(invoice.includedGstCents)}\n`,
  );
}

export async function runCliView(controller: OrderingController): Promise<void> {
  const restaurant = controller.getRestaurant();
  let orderAgain = true;

  printHeader(restaurant);

  while (orderAgain) {
    printMenu(restaurant);
    const input = await collectOrder(restaurant);
    printReceipt(controller, input);

    orderAgain = await confirm({
      message: "Would you like to place another order?",
      default: false,
    });

    if (orderAgain) {
      console.log();
    }
  }

  console.log(`Thanks for ordering from ${restaurant.name}! 👋`);
}
