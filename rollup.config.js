import svelte from 'rollup-plugin-svelte';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import gzip from 'rollup-plugin-gzip';
import { minify } from 'uglify-es';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default {
  moduleContext: {
  },
	input: 'src/main.js',	
	output: {
	  name: 'H801',
    sourcemap: !production,  
    format: 'iife',
    file: 'public/bundle.js',
  },
  watch: {
    include: 'src/**'
  },
	plugins: [
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
        "static/index.html": "public/index.html",
        "static/iro.js/iro.min.js": "public/iro.min.js",
        "static/font/fontello.woff": "public/icons.woff",
        verbose: true
    }),


    !production && copy({
        "static/test_files/config": "public/config",
        "static/test_files/status": "public/status",
        verbose: true
    }),

		// If we're building for production (npm run build
		// instead of npm run dev), transpile and minify
		production && buble({ exclude: 'node_modules/**' }),
		production && uglify({}, minify),
    gzip({}),

	]
};