import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  /**
   * IMPORTANT:
   * Set base to "./" so Vite outputs relative asset paths ("./assets/...") instead of
   * absolute ones ("/assets/...").
   *
   * In environments like Anki addons, files are served from a nested path
   * (e.g. /_addons/<id>/web/), not from the domain root. Absolute paths would resolve
   * incorrectly and cause 404s, especially for dynamically imported JS chunks.
   *
   * With "./":
   * - All JS chunk imports remain relative and resolve automatically within /web/assets/
   *   once the entry script is loaded.
   *
   * NOTE:
   * The direct imports in front.html (e.g. <script src="./assets/..."> and <link href="./assets/...">)
   * do NOT work as-is in Anki templates. Anki does not resolve "./" relative to the addon folder.
   *
   * These are handled separately by a Python function (fix_vite_paths in __init__.py),
   * which rewrites them to:
   *   /_addons/<addon_id>/web/assets/...
   *
   * This allows Anki to correctly load the entry files. After that, all nested imports
   * work because they are relative ("./") and resolve from within the already-correct
   * /web/assets/ directory.
   *
   * Without this combination (base="./" + Python rewrite), assets will fail to load.
   */
  
  base: "./",
  build: {
    outDir: "web",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        front: resolve(__dirname, "front.html"),
        back: resolve(__dirname, "back.html"),
      },
    },
  },
});