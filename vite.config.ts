import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // watch: {
    //   include: "src/**",
    //   exclude: "node_modules/**",
    // },
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "./src/content.ts"),
      },
      output: {
        dir: "dist",
        entryFileNames: ({ name }) => {
          if (name === "content") return "[name].js";
          return "assets/[name].[hash].js";
        },
        chunkFileNames: "assets/[name].[hash].js",
      },
    },
  },
});
