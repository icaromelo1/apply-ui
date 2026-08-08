import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue(),
    // Os componentes usam os auto-imports do Nuxt (ref, computed, watch…).
    // Sem isto o teste falha com "ref is not defined" — que é ambiente, não bug.
    AutoImport({ imports: ["vue"], dts: false }),
  ],
  test: {
    environment: "happy-dom",
    globals: true,
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
});
