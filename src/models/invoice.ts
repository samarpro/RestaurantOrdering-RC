export interface InvoiceLine {
  readonly productId: string;
  readonly description: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
  readonly subtotalCents: number;
}

export interface Invoice {
  readonly lines: readonly InvoiceLine[];
  readonly totalCents: number;
  readonly includedGstCents: number;
}
