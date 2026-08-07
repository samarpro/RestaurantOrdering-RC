# Restaurant Order Processor

A TypeScript restaurant ordering application with interactive CLI and responsive web interfaces. It builds orders from configurable restaurant data, groups line items, calculates totals, and displays the GST included in each order.

## Features

- Dynamic menu and restaurant configuration
- CLI powered by Inquirer
- Plain HTML web interface styled with Tailwind CSS
- Shared controller and business logic across both interfaces
- Unit-tested pricing, GST, formatting, and validation

## Run locally

```bash
npm install
npm run dev:cli  # interactive CLI
npm run dev:web  # web interface
```

## Verify

```bash
npm test
npm run check
npm run build:web
```
