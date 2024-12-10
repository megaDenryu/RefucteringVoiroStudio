import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        option: resolve(__dirname, "option.html"),
        test1012: resolve(__dirname, "test1012.html"),
        index_Human2: resolve(__dirname, "index_Human2.html"),
        setting: resolve(__dirname, "setting.html"),
        AppVoiroStudio: resolve(__dirname, "AppVoiroStudio.html"),
      },
      onwarn(warning, warn) {
        // 警告を無視する
        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT') {
          warn(warning);
        }
      }
    },
  },
});