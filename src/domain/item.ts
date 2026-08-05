export type ItemCategory = "burger" | "soft-drink" | "bundle";

export interface Item {
  readonly id: string;
  readonly name: string;
  readonly category: ItemCategory;
  readonly unitPriceCents: number;
}
