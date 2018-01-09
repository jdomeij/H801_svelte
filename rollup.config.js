import svelte from 'rollup-plugin-svelte';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import gzip from 'rollup-plugin-gzip';
import { minify } from 'uglify-es';
import copy from 'rollup-plugin-copy';
import resolve from 'rollup-plugin-node-resolve';

const production = !process.env.ROLLUP_WATCH;
const targetFolder = production?'dist/':'dev_test/'


export default {
  moduleContext: {
  },
	input: 'src/main.js',	
	output: {
	  name: 'H801',
    sourcemap: !production,  
    format: 'iife',
    file: targetFolder + 'bundle.js',
  },
  watch: {
    include: 'src/**'
  },
	plugins: [
    resolve({
      browser: true,
    }),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			/*css: css => {
				css.write('public/bundle.css');
			},*/
      include: ['src/**/*.html'],
			// this results in smaller CSS files
			cascade: false,
		}),

    copy({
        'static/index.html':          targetFolder + 'index.html',
        'static/iro.js/iro.min.js':   targetFolder + 'iro.min.js',
        'static/font/fontello.woff':  targetFolder + 'icons.woff',
        verbose: true
    }),

		// If we're building for production (npm run build
		// instead of npm run dev), transpile and minify
		production && buble({ exclude: 'node_modules/**' }),
		production && uglify({}, minify),
    production && gzip({}),

	]
};