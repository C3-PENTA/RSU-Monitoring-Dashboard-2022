import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  server: {
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // there're a known issue that caused duplicate the global styles https://github.com/vitejs/vite/issues/4448
        additionalData: '@use "src/styles" as *;',
      },
    },
  },
  build: {
    commonjsOptions: {
      ignoreTryCatch: false,
    },
  },
});
