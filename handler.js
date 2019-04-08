const { parse_args, current_path } = require( './functions' );
const $gulp                        = require( 'gulp' );
const $webpack                     = require( 'webpack-stream' );
const $revert_path                 = require( 'gulp-revert-path' );
const supportsColor                = require( 'supports-color' );
const fancyLog                     = require( 'fancy-log' );
const $rename                      = require( 'gulp-rename' );
const $scss                        = require( 'gulp-sass' );
const $minify_css                  = require( 'gulp-clean-css' );
const $autoprefixer                = require( 'gulp-autoprefixer' );
const $uglify                      = require( 'gulp-uglify' );
const $babel                       = require( 'gulp-babel' );
const $combine_files               = require( 'gulp-combine-files' );
const $concat                      = require( 'gulp-concat' );

/**
 * Gulp Handler.
 */
class GulpHandler {
	/**
	 *
	 * @param $src
	 * @param $file_config
	 * @param $global_config
	 */
	constructor( $src, $file_config, $global_config ) {
		this.src      = $src;
		this.config   = $file_config;
		this.global   = $global_config;
		this.instance = $gulp.src( this.src );
	}

	/**
	 * Returns Config Values.
	 * @param $type
	 * @param $config
	 * @returns {null|JS_Parse_Args|*}
	 */
	get_config( $type = '', $config = {} ) {
		if( typeof this.global[ $type ] !== 'undefined' ) {
			$config = ( true === $config ) ? {} : $config;
			if( typeof $config === 'string' ) {
				return ( typeof this.global[ $config ] !== 'undefined' ) ? this.global[ $config ] : $config;
			} else {
				let $global_config = this.global[ $type ];
				return parse_args( $config, $global_config, false );
			}
		}
		return ( true === $config ) ? null : $config;
	}

	/**
	 * Inits Workout.
	 * @returns {Promise<void>}
	 */
	async init() {
		fancyLog( ' ' );
		fancyLog( this.src + ' Started ' );
		for( let $id in this.config ) {
			if( this.config.hasOwnProperty( $id ) && this.config[ $id ] !== false && typeof GulpHandler.prototype[ $id ] === 'function' ) {
				await this[ $id ]( this.config[ $id ] );
			}
		}
		await this.save();
		fancyLog( ' ' );
	}

	/**
	 * Saves Output.
	 * @returns {Promise<*>}
	 */
	async save() {
		return new Promise( ( resolve ) => {
			if( typeof this.config.rename !== 'undefined' ) {
				fancyLog( 'Renaming To ' + this.config.rename );
				this.instance = this.instance.pipe( $rename( this.config.rename ) );
			}

			this.instance = this.instance.pipe( $gulp.dest( current_path + '/' + this.config.dist ) ).on( 'end', () => {
				fancyLog( 'File Saved In ' + this.config.dist );
				fancyLog( '' );
				resolve();
			} );
		} );
	}

	/**
	 * Triggers Webpack.
	 * @param $arg
	 * @returns {Promise<*>}
	 */
	async webpack( $arg ) {
		fancyLog( '---> Webpack Start' );
		let $options = this.get_config( 'webpack', $arg );

		let webpack_done = function( err, stats ) {
			if( err ) {
				// The err is here just to match the API but isnt used
				return;
			}
			stats = stats || {};

			fancyLog( stats.toString( {
				colors: supportsColor.stdout.hasBasic,
				hash: false,
				timings: false,
				chunks: false,
				chunkModules: false,
				modules: false,
				children: true,
				version: true,
				cached: false,
				cachedAssets: false,
				reasons: false,
				source: false,
				errorDetails: false
			} ) );
		};

		return new Promise( ( resolve ) => {
			this.instance = this.instance.pipe( $revert_path() );
			this.instance = this.instance.pipe( $webpack( $options, null, ( err, stats ) => {
				webpack_done( err, stats );
				fancyLog( '---> Webpack End' );
				resolve();
			} ) );
			this.instance = this.instance.pipe( $revert_path() );
		} );
	}

	/**
	 * Triggers SCSS Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async scss( $arg ) {
		return new Promise( ( resolve ) => {
			fancyLog( '---> SCSS Start' );
			this.instance = this.instance.pipe( $scss( this.get_config( 'scss', $arg ) ).on( 'error', fancyLog ) );
			fancyLog( '---> SCSS End' );
			resolve();
		} );
	}

	/**
	 * Triggers minify Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async minify( $arg ) {
		return new Promise( ( resolve ) => {
			fancyLog( '---> Minify Start' );
			let $options  = this.get_config( 'minify', $arg );
			this.instance = this.instance.pipe( $minify_css( $options.options.args, $options.options.callback ) )
								.on( 'error', fancyLog );
			fancyLog( '---> Minify End' );
			resolve();
		} );
	}

	/**
	 * Triggers Autoprefixer Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async autoprefixer( $arg ) {
		return new Promise( ( resolve ) => {
			fancyLog( '---> Autoprefixer Start' );
			let $options  = this.get_config( 'autoprefixer', $arg );
			this.instance = this.instance.pipe( $autoprefixer( $options ) )
								.on( 'error', fancyLog );
			fancyLog( '---> Autoprefixer End' );
			resolve();
		} );
	}

	/**
	 * Triggers uglify Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async uglify( $arg ) {
		return new Promise( ( resolve ) => {
			fancyLog( '---> Uglify Start' );
			let $options  = this.get_config( 'uglify', $arg );
			this.instance = this.instance.pipe( $uglify( $options ) )
								.on( 'error', fancyLog );
			fancyLog( '---> Uglify End' );
			resolve();
		} );
	}

	/**
	 * Triggers babel Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async babel( $arg ) {
		return new Promise( ( resolve ) => {
			fancyLog( '---> Bable Start' );
			let $options  = this.get_config( 'babel', $arg );
			this.instance = this.instance.pipe( $babel( $options ) )
								.on( 'error', fancyLog );
			fancyLog( '---> Babel End' );
			resolve();
		} );
	}

	/**
	 * Triggers combine_files  Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async combine_files( $arg ) {
		return new Promise( ( resolve ) => {
			fancyLog( '---> Combine Files Start' );
			let $options  = this.get_config( 'combine_files', $arg );
			this.instance = this.instance.pipe( $combine_files( $options ) );
			fancyLog( '---> Combine Files End' );
			resolve();
		} );
	}

	/**
	 * Triggers Concat Compile.
	 * @param $arg
	 * @returns {*}
	 */
	async concat( $arg ) {

		return new Promise( ( resolve ) => {
			fancyLog( '---> Concat Start' );
			let $options = this.get_config( 'concat', $arg );

			if( typeof $options.options === 'object' && typeof $options.options.filename !== 'undefined' ) {
				if( $options.src ) {
					this.instance = this.instance.pipe( $gulp.src( $options.src ) )
										.pipe( $concat( $options.options.filename, $options.options ) )
										.on( 'error', fancyLog );
				} else {
					this.instance = this.instance.pipe( $concat( $options.options.filename, $options.options ) )
										.on( 'error', fancyLog );
				}

			} else if( typeof $options === 'string' ) {
				this.instance = this.instance.pipe( $concat( $options ) )
									.on( 'error', fancyLog );
			}
			fancyLog( '---> Concat End' );
			resolve();
		} );
	}
}

module.exports = {
	handler: GulpHandler,
};