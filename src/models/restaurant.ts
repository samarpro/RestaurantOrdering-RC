import type { Menu } from "./menu.js";

export interface TaxConfiguration {
  readonly name: string;
  readonly ratePercent: number;
  readonly pricesInclusive: boolean;
}

export interface Restaurant {
  readonly id: string;
  readonly name: string;
  readonly menu: Menu;
  readonly tax: TaxConfiguration;
}
