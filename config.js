/**
 * SCSS Config
 {
	"file_src_path":{
		"dist":"path_to_dist_folder",
		"scss":true # TRUE / FALSE / SCSS Config,
		"autoprefixer":true # TRUE / FALSE / AutoPrefixer Config,
		"concat":true # TRUE / FALSE / STRING (FILENAME) / Concat Config. | {filename:"somefile.css","options":{}}
		"minify":true # TRUE / FALSE / Minify Config,
		"sourcemap":true # TRUE / FALSE / Folder String
	},
	"file_src_path":"dist_path",
 }
 *
 */
var path    = require( 'path' ),
	webpack = require( 'webpack' );


let $js        = {
	project_name: "Sample",
	scss: {
		"src/scss/style.scss": {
			dist: "assets/css",
			watch: [ 'src/scss/parts/*.scss' ],
		},
		"src/scss/style2.scss": { dist: "assets/css/", scss: true, autoprefixer: true, concat: false, minify: true, },
		"assets/css/style2.css": {
			dist: "assets/css/", scss: false, autoprefixer: false, minify: false,
			concat: {
				"filename": 'final.css',
				"src": [ 'assets/css/style.css', 'assets/css/style2.css' ],
			}
		}
	},

	js: {
		"src/js/script.js": {
			dist: "assets/js",
			webpack: true,
			combine_files: false,

		},
		"src/js/append.js": {
			dist: "assets/combine-js",
			webpack: false,
			combine_files: true,
		},
		"src/js/prepend.js": {
			dist: "assets/combine-js",
			webpack: false,
			combine_files: true,
		},
		"src/js/nested.js": {
			dist: "assets/combine-js",
			webpack: false,
			combine_files: true,
		},
		"src/js/inline.js": {
			dist: "assets/combine-js",
			webpack: false,
			combine_files: true,
		},
	},

	default_config: {
		combine_files: {
			append: 'gulp-append',
			prepend: 'gulp-prepend',
			inline: 'gulp-inline',
		},
		minify_css: {
			args: {},
			callback: false
		},
		concat: {},
		scss: {
			outputStyle: "expanded"
		},
		autoprefixer: {
			browsers: [ "last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4" ],
			cascade: false
		},
		sourcemap: "../maps",
		webpack: {
			mode: "production",
			module: {
				rules: [ {
					test: /\.js$/,
					loader: 'babel-loader',
					options: {
						presets: [ 'es2015' ]
					}
				} ]
			},
		},
	},
};
module.exports = $js;