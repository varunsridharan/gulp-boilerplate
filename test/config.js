module.exports = {
	files: {
		'src/js/bable/bable.js': [
			{
				dist: 'dist/js',
				babel: true,
				rename: 'bable.js',
				watch: true,
			},
			{
				dist: 'dist/js',
				babel: true,
				uglify: true,
				rename: 'bable.min.js',
				watch: true,
			}
		],
		'src/js/webpack/index.js': {
			dist: 'dist/js',
			webpack: 'webpack_dev',
			rename: 'webpack.js',
		},

		'dist/js/bable.js': {
			dist: 'dist/js',
			uglify: true,
			rename: 'bable.min.js',
		},
		'dist/js/webpack.js': {
			dist: 'dist/js',
			uglify: true,
			rename: 'webpack.min.js',
		},

		'src/js/combine/combine.js': {
			dist: 'dist/js',
			combine_files: true,
			rename: 'combine.js',
		},

		'src/js/concat/!*.js': {
			dist: 'dist/js',
			concat: 'concat.js',
			babel: true,
			rename: 'concat.js',
		}
	}

};