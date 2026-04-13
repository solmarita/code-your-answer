import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "web", // replaces "dist" as new output directory, to match Anki's web directory
    emptyOutDir: true, // wipes old filed on build
    rollupOptions: {
      input: {
        front: resolve(__dirname, "front.html"),
        back: resolve(__dirname, "back.html"),
      },
    },
  },
});