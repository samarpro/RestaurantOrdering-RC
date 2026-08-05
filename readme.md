# Restaurant Order Processor

A restaurant ordering service with web and command-line interfaces. Both
interfaces will use the same backend so that menu prices, order validation, GST,
and invoice calculations have one source of truth.

## Technology

- Node.js and TypeScript
- Express 5 for the HTTP service
- HTML and Tailwind CSS 4 for the web interface
- Inquirer for the interactive command-line interface
- Node's test runner for automated tests

The project intentionally starts without a database or frontend framework. The
menu can be held in memory, and the web and CLI clients can remain small while
the ordering rules stay independently testable.

## Getting started

Requirements: Node.js 22.18 or later.

```sh
npm install
npm run check
npm test
npm run build
```

The API and user interfaces will be introduced on focused feature branches.

## Structure

```text
public/            Static web assets served by the backend
src/
  cli/             Interactive command-line interface
  models/          Shared application data shapes
  routes/          HTTP endpoint definitions
  services/        Ordering and invoice use cases
  utils/           Small stateless helpers
  web/             Web source files, including Tailwind input
tests/             Automated tests mirroring src/
```

Money is represented as integer cents to prevent floating-point rounding errors.
Prices are owned by the backend; clients submit product IDs and quantities only.

## Planned delivery slices

1. Establish the project foundation and data invariants.
2. Expose the restaurant menu through the backend.
3. Process orders and return GST-inclusive invoices.
4. Build the web ordering interface.
5. Build the CLI ordering interface.

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch and commit conventions.
