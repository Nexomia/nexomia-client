import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@linaria/rollup';
import tsconfigPaths from 'vite-tsconfig-paths';
import svrrPlugin from 'vite-plugin-svgr';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svrrPlugin({
      svgrOptions: {
        icon: true
      }
    }),
    linaria(),
    babel()
  ]
});
