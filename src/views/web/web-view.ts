import type { OrderingController } from "../../controllers/index.js";
import type { Invoice, PlaceOrderInput, Product } from "../../models/index.js";
import { formatCurrency } from "../shared/currency.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (element === null) {
    throw new Error(`Required UI element "${id}" was not found`);
  }

  return element as T;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function toOrderInput(quantities: ReadonlyMap<string, number>): PlaceOrderInput {
  return {
    items: Array.from(quantities, ([productId, quantity]) => ({ productId, quantity })),
  };
}

export function initialiseWebView(controller: OrderingController): void {
  const restaurant = controller.getRestaurant();
  const { menu, tax } = restaurant;
  const menuElement = requireElement<HTMLDivElement>("menu");
  const emptyOrderElement = requireElement<HTMLDivElement>("empty-order");
  const selectedItemsElement = requireElement<HTMLDivElement>("selected-items");
  const estimatedTotalElement = requireElement<HTMLElement>("estimated-total");
  const estimatedGstElement = requireElement<HTMLElement>("estimated-gst");
  const estimatedGstLabelElement = requireElement<HTMLElement>("estimated-gst-label");
  const processButton = requireElement<HTMLButtonElement>("process-order");
  const clearButton = requireElement<HTMLButtonElement>("clear-order");
  const errorElement = requireElement<HTMLParagraphElement>("order-error");
  const receiptElement = requireElement<HTMLElement>("receipt");
  const receiptLinesElement = requireElement<HTMLDivElement>("receipt-lines");
  const receiptTotalElement = requireElement<HTMLElement>("receipt-total");
  const receiptGstElement = requireElement<HTMLElement>("receipt-gst");
  const receiptGstLabelElement = requireElement<HTMLElement>("receipt-gst-label");
  const restaurantNameElement = requireElement<HTMLElement>("restaurant-name");
  const taxDisclosureElement = requireElement<HTMLElement>("tax-disclosure");

  restaurantNameElement.textContent = restaurant.name;
  estimatedGstLabelElement.textContent = `Including ${tax.name} (${tax.ratePercent}%)`;
  receiptGstLabelElement.textContent = `Including ${tax.name} (${tax.ratePercent}%)`;
  taxDisclosureElement.textContent = `Prices include ${tax.ratePercent}% ${tax.name}.`;

  const quantities = new Map<string, number>();
  const quantityLabels = new Map<string, HTMLOutputElement>();

  function getInvoice(): Invoice | undefined {
    if (quantities.size === 0) {
      return undefined;
    }

    return controller.processOrder(toOrderInput(quantities));
  }

  function hideReceipt(): void {
    receiptElement.classList.add("hidden");
  }

  function showError(error: unknown): void {
    errorElement.textContent = error instanceof Error ? error.message : "Unable to process order";
    errorElement.classList.remove("hidden");
  }

  function clearError(): void {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  }

  function renderOrderSummary(): void {
    clearError();

    try {
      const invoice = getInvoice();
      const hasItems = invoice !== undefined;

      emptyOrderElement.classList.toggle("hidden", hasItems);
      clearButton.classList.toggle("hidden", !hasItems);
      processButton.disabled = !hasItems;
      selectedItemsElement.replaceChildren();

      if (invoice === undefined) {
        estimatedGstElement.textContent = formatCurrency(0);
        estimatedTotalElement.textContent = formatCurrency(0);
        return;
      }

      for (const line of invoice.lines) {
        const row = createElement("div", "flex items-start justify-between gap-4");
        const details = createElement("div", "min-w-0");
        details.append(
          createElement("p", "truncate text-sm font-semibold text-stone-200", line.description),
          createElement(
            "p",
            "mt-1 text-xs text-stone-500",
            `${formatCurrency(line.unitPriceCents)} × ${line.quantity}`,
          ),
        );
        row.append(
          details,
          createElement("span", "shrink-0 text-sm font-bold text-stone-200", formatCurrency(line.subtotalCents)),
        );
        selectedItemsElement.append(row);
      }

      estimatedGstElement.textContent = formatCurrency(invoice.includedGstCents);
      estimatedTotalElement.textContent = formatCurrency(invoice.totalCents);
    } catch (error) {
      showError(error);
    }
  }

  function setQuantity(productId: string, nextQuantity: number): void {
    if (nextQuantity <= 0) {
      quantities.delete(productId);
    } else {
      quantities.set(productId, nextQuantity);
    }

    const label = quantityLabels.get(productId);
    if (label !== undefined) {
      label.value = String(quantities.get(productId) ?? 0);
      label.textContent = label.value;
    }

    hideReceipt();
    renderOrderSummary();
  }

  function createProductCard(product: Product, categoryIcon: string): HTMLElement {
    const card = createElement(
      "article",
      "group rounded-2xl border border-white/10 bg-stone-900/70 p-5 transition hover:-translate-y-0.5 hover:border-orange-400/40 hover:bg-stone-900 hover:shadow-xl hover:shadow-black/20",
    );
    const topRow = createElement("div", "flex items-start justify-between gap-4");
    const identity = createElement("div", "flex min-w-0 items-center gap-4");
    identity.append(createElement("span", "grid size-14 shrink-0 place-items-center rounded-2xl bg-white/5 text-3xl", categoryIcon));

    const title = createElement("div", "min-w-0");
    title.append(
      createElement("h3", "truncate text-lg font-bold text-white", product.name),
      createElement("p", "mt-1 text-sm text-stone-500", `${tax.name} included`),
    );
    identity.append(title);
    topRow.append(identity, createElement("span", "shrink-0 text-lg font-black text-orange-400", formatCurrency(product.unitPriceCents)));

    const controls = createElement("div", "mt-5 flex items-center justify-between border-t border-white/10 pt-4");
    controls.append(createElement("span", "text-xs font-bold uppercase tracking-[0.16em] text-stone-500", "Quantity"));

    const stepper = createElement("div", "flex items-center gap-1 rounded-xl bg-black/25 p-1");
    const decreaseButton = createElement("button", "grid size-9 place-items-center rounded-lg text-lg font-bold text-stone-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400", "−");
    decreaseButton.type = "button";
    decreaseButton.setAttribute("aria-label", `Remove one ${product.name}`);
    decreaseButton.addEventListener("click", () => setQuantity(product.id, (quantities.get(product.id) ?? 0) - 1));

    const quantity = createElement("output", "w-9 text-center text-sm font-black text-white", "0");
    quantity.setAttribute("aria-label", `${product.name} quantity`);
    quantityLabels.set(product.id, quantity);

    const increaseButton = createElement("button", "grid size-9 place-items-center rounded-lg bg-orange-500 text-lg font-black text-stone-950 transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-orange-400", "+");
    increaseButton.type = "button";
    increaseButton.setAttribute("aria-label", `Add one ${product.name}`);
    increaseButton.addEventListener("click", () => setQuantity(product.id, (quantities.get(product.id) ?? 0) + 1));

    stepper.append(decreaseButton, quantity, increaseButton);
    controls.append(stepper);
    card.append(topRow, controls);
    return card;
  }

  function renderMenu(): void {
    for (const category of menu.categories) {
      const categoryProducts = menu.products.filter(
        (product) => product.category === category.id,
      );

      if (categoryProducts.length === 0) {
        continue;
      }

      const section = createElement("section", "space-y-4");
      const heading = createElement("div", "flex items-center gap-3");
      heading.append(
        createElement("h2", "text-xl font-bold text-white", category.name),
        createElement("span", "h-px flex-1 bg-white/10"),
      );

      const grid = createElement("div", "grid gap-4 sm:grid-cols-2");
      for (const product of categoryProducts) {
        grid.append(createProductCard(product, category.icon));
      }

      section.append(heading, grid);
      menuElement.append(section);
    }
  }

  function renderReceipt(invoice: Invoice): void {
    receiptLinesElement.replaceChildren();

    for (const line of invoice.lines) {
      const row = createElement("div", "flex justify-between gap-4 text-sm");
      row.append(
        createElement("span", "text-stone-600", `${line.description} × ${line.quantity}`),
        createElement("span", "font-bold", formatCurrency(line.subtotalCents)),
      );
      receiptLinesElement.append(row);
    }

    receiptTotalElement.textContent = formatCurrency(invoice.totalCents);
    receiptGstElement.textContent = formatCurrency(invoice.includedGstCents);
    receiptElement.classList.remove("hidden");
    receiptElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  processButton.addEventListener("click", () => {
    clearError();

    try {
      const invoice = getInvoice();
      if (invoice !== undefined) {
        renderReceipt(invoice);
      }
    } catch (error) {
      showError(error);
    }
  });

  clearButton.addEventListener("click", () => {
    for (const productId of quantities.keys()) {
      const label = quantityLabels.get(productId);
      if (label !== undefined) {
        label.value = "0";
        label.textContent = "0";
      }
    }

    quantities.clear();
    hideReceipt();
    renderOrderSummary();
  });

  renderMenu();
  renderOrderSummary();
}
