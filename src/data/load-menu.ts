import type { Menu } from "../models/index.js";

export async function loadMenu(): Promise<Menu> {
  const menuUrl = new URL("./menu.json", import.meta.url);
  const response = await fetch(menuUrl);

  if (!response.ok) {
    throw new Error("The restaurant menu could not be loaded");
  }

  return (await response.json()) as Menu;
}
