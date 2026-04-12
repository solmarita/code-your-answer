import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        front: "front.html",
        back: "back.html",
      },
    },
  },
});