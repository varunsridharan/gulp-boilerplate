module.exports = {
	project_name: "Sample",

	scss: false,

	js: {
		"src/js/script.js": {
			dist: "assets/js",
			webpack: true,
			combine_files: false,
			concat: "script.js",
		},
	},

	/**
	 * Settings any feature to false will not trigger for any files untill its
	 * overridden in file config.
	 * js:{
	 *     "your_file_source":{
	 *         scss:true,
	 *         dist:"your_file_dist",
	 *     }
	 * }
	 */
	status: {
		combine_files: true,
		minify: true,
		concat: true,
		scss: true,
		sourcemap: true,
		autoprefixer: true,
		webpack: true,
		babel: false,
		parcel: false,
		uglify: true,
		rollup: false,
	},

	default_config: {
		combine_files: { append: 'wponion-append', prepend: 'wponion-prepend', inline: 'wponion-inline', },
		minify: { args: {}, callback: false },
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
		parcel: false,
		uglify: true,
		babel: {
			presets: [ '@babel/env' ],
		},
	},
};
