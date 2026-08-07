import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/views/web",
  plugins: [tailwindcss()],
  build: {
    outDir: "../../../dist/web",
    emptyOutDir: true,
  },
});
