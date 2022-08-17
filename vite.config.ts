/*
 * @Description: Vite Config
 * @Version: 2.1
 * @Author: Mirage
 * @Date: 2021-11-26 10:33:44
 * @LastEditors: Mirage
 * @LastEditTime: 2022-08-17 17:59:54
 */
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue2';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import legacy from '@vitejs/plugin-legacy';
import Gzip from 'vite-plugin-compression';
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Gzip({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    splitVendorChunkPlugin(),
    // createSvgIconsPlugin({
    //   iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    //   symbolId: 'icon-[dir]-[name]',
    // }),
    /**
     * https://github.com/intlify/vue-i18n-next/issues/789
     * https://blog.csdn.net/yjl13598765406/article/details/125498134
     */
    vueI18n({
      include: path.resolve(__dirname, './path/to/src/locales/**'),
    }),
    legacy({
      targets: ['defaults', 'not ie < 9'],
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, 'assets'),
      components: path.resolve(__dirname, 'components'),
      config: path.resolve(__dirname, 'config'),
      store: path.resolve(__dirname, 'store'),
      utils: path.resolve(__dirname, 'utils'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  build: {
    terserOptions: {
      /**
       *
       *  Remove Console and Debugger on Production Mode
       *
       */
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'element-ui': ['element-ui'],
        },
      },
    },
    minify: 'terser',
  },
  css: {
    modules: {
      generateScopedName: 'miya__[name]__[hash:base64:4]',
      hashPrefix: 'prefix',
    },
    preprocessorOptions: {
      /**
       *
       *  Global Less Variable
       *
       */
      less: {
        additionalData: '@import "@/style/variable.less";',
        javascriptEnabled: true,
      },
    },
  },

  server: {
    host: '0.0.0.0',
    port: 12460,
    open: true,
    https: false,
    proxy: {
      '/api': {
        // target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
