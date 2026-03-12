import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2019',

    // Disable sourcemaps for production library
    sourcemap: false,

    // Fast and safe minification
    minify: 'esbuild',

    // Extract CSS into separate file
    cssCodeSplit: true,

    // Clean dist folder before build
    emptyOutDir: true,

    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ChatyPlayer',

      formats: ['es', 'cjs'],

      fileName: (format) =>
        format === 'es'
          ? 'chatyplayer.es.js'
          : 'chatyplayer.cjs.js'
    },

    rollupOptions: {
      // No external dependencies yet
      external: [],

      output: {
        exports: 'named',

        // stable asset output
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles/[name][extname]'
          }

          return '[name][extname]'
        },

        // improve tree shaking
        generatedCode: {
          constBindings: true
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  esbuild: {
    // Remove license comments from bundles
    legalComments: 'none'
  }
})