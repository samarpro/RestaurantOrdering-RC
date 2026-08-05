import { createApp } from "./app.ts";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const app = createApp();

app.listen(port, () => {
  console.log(`Restaurant Order Processor listening on http://localhost:${port}`);
});
