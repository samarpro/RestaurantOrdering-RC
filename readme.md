# Restaurant Order Processor

A small TypeScript application for building restaurant orders and producing
GST-inclusive invoices.

## Getting started

```sh
npm install
npm run check
npm test
npm start
```

## Project structure

- `src/domain/item.ts` defines the menu item contract.
- `src/domain/invoice.ts` defines the invoice and invoice line contracts.
- `src/index.ts` is the future command-line entry point.
- `test/` will contain unit tests as behaviour is introduced.

Money is represented as integer cents to avoid floating-point rounding errors.
