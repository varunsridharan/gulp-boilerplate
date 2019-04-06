module.exports = {
	project_name: 'Boiler Plate',

	files: {
		'your-file': {
			dist: '', // Relative Path To Save The File.
			src: '', // Relative Path To Get The File.
			watch: [ 'file', 'file2', 'file3' ],
			webpack: false,
			scss: false,
			uglify: false,
			minify: false,
			babel: false,
			combine_files: false,
			concat: false,
			rename: false,
			autoprefixer: false
		},
		'your-file-2': [
			{
				// Below Config Used To Create Minifed File.
				dist: 'assets/css',
				scss: true,
				uglify: true,
				concat: 'style.min.css',
			},
			{
				// Below Config Used To Create Unminifed File
				dist: 'assets/css',
				scss: true,
				uglify: false,
				concat: 'style.css',
			}
		]
	},

	config: {
		concat: {},
		uglify: true,
		babel: {
			presets: [ '@babel/env' ],
		},
		webpack: {
			mode: 'production',
			output: {
				filename: '[name].js',
			},
			target: 'node',
			module: {
				rules: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						options: {
							presets: [ 'es2015' ]
						}
					}
				]
			},
		},
		combine_files: {
			append: 'wponion-append',
			prepend: 'wponion-prepend',
			inline: 'wponion-inline',
		},
		scss: {
			outputStyle: 'expanded'
		},
		autoprefixer: {
			browsers: [ 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ],
			cascade: false
		},
		minify: { options: {}, callback: {} },
	},
};