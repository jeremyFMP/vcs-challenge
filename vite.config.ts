import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";

import { normalizePath } from "vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        // {
        //   src: "/node_modules/cesium/Build/Cesium",
        //   dest: "/cesium",
        // },
        {
          src: normalizePath(
            path.resolve(
              __dirname,
              "./node_modules/cesium/Build/Cesium/Workers"
            )
          ),
          dest: "/",
        },
        {
          src: normalizePath(
            path.resolve(
              __dirname,
              "./node_modules/cesium/Build/Cesium/ThirdParty"
            )
          ),
          dest: "/",
        },
        {
          src: normalizePath(
            path.resolve(__dirname, "./node_modules/cesium/Build/Cesium/Assets")
          ),
          dest: "/",
        },
        {
          src: normalizePath(
            path.resolve(
              __dirname,
              "./node_modules/cesium/Build/Cesium/Widgets"
            )
          ),
          dest: "/",
        },
      ],
    }),
    vue(),
  ],
});
