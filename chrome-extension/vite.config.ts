import { defineConfig } from "vite";
import { resolve } from "path";
import { chromeExtension } from "vite-plugin-chrome-extension";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        minify: false,
        rollupOptions: {
            input: "src/manifest.json"
        }
    },
    plugins: [
        chromeExtension()
    ],
})
