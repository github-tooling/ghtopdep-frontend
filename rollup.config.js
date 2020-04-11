import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import dotenv from 'dotenv'

dotenv.config()
const production = !process.env.ROLLUP_WATCH;


export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js"
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ postcss: true }),
      // enable run-time checks when not in production
      dev: !production,
      css: css => {
        css.write("public/components.css");
      }
    }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    replace({
      BASE_URL: production ? process.env.PROD: process.env.DEV
    }),
  ],
  watch: {
    clearScreen: false
  }
};
