module.exports = {
	project_name: "Sample",

	scss: {
		"src/scss/style.scss": { dist: "assets/css", watch: [ 'src/scss/parts/*.scss' ], },
		"src/scss/style2.scss": { dist: "assets/css/", scss: true, autoprefixer: true, concat: false, minify: true, },
		"assets/css/style2.css": {
			dist: "assets/css/",
			scss: false,
			autoprefixer: false,
			minify: false,
			concat: { filename: 'final.css', src: [ 'assets/css/style.css', 'assets/css/style2.css' ] }
		}
	},

	js: {
		"src/js/script.js": {
			dist: "assets/js", webpack: true,
			combine_files: false,
			concat: "script.js",
		},
		"src/js/append.js": { dist: "assets/combine-js", webpack: false, combine_files: true, },
		"src/js/prepend.js": { dist: "assets/combine-js", webpack: false, combine_files: true, },
		"src/js/nested.js": { dist: "assets/combine-js", webpack: false, combine_files: true, },
		"src/js/inline.js": { dist: "assets/combine-js", webpack: false, combine_files: true, },
	},

	default_config: {
		combine_files: { append: 'gulp-append', prepend: 'gulp-prepend', inline: 'gulp-inline', },
		minify_css: { args: {}, callback: false },
		concat: {},
		scss: { outputStyle: "expanded" },
		sourcemap: "../maps",
		autoprefixer: {
			browsers: [ "last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4" ],
			cascade: false
		},
		webpack: {
			mode: "production",
			output: { filename: '[name].js', },
			module: { rules: [ { test: /\.js$/, loader: 'babel-loader', options: { presets: [ 'es2015' ] } } ] },
		},
	},
};
