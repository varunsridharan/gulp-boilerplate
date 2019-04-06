const { vsp_load_module, get_cwd, parse_args } = require( './functions' );
var log                                        = require( 'fancy-log' );

/**
 * Required Imports.
 */
const $gulp          = vsp_load_module( 'gulp' ),
	  $rename        = vsp_load_module( 'gulp-rename' ),
	  $util          = vsp_load_module( 'gulp-util' ),
	  $scss          = vsp_load_module( 'gulp-sass' ),
	  $minify_css    = vsp_load_module( 'gulp-clean-css' ),
	  $gbabel        = vsp_load_module( 'gulp-babel' ),
	  $concat        = vsp_load_module( 'gulp-concat' ),
	  $uglify        = vsp_load_module( 'gulp-uglify' ),
	  $autoprefixer  = vsp_load_module( 'gulp-autoprefixer' ),
	  $combine_files = vsp_load_module( 'gulp-combine-files' ),
	  $revert_path   = vsp_load_module( 'gulp-revert-path' ),
	  $webpack       = require( 'webpack-stream' );

/**
 * Gulp Handler.
 */
class GulpHandler {
	constructor( $src, $config, $global_config ) {
		this.src      = $src;
		this.config   = $config;
		this.gconfig  = $global_config;
		this.instance = $gulp.src( $src );
	}

	init( resolve, reject ) {
		log( this.src + ' Started' );
		if( typeof reject !== 'undefined' ) {
			this.instance = this.instance.on( 'error', reject );
		}
		let $promises = [];

		for( let key in this.config ) {
			if( this.config.hasOwnProperty( key ) ) {
				if( GulpHandler.prototype[ key ] !== undefined && 'function' === typeof GulpHandler.prototype[ key ] ) {
					$promises.push( this[ key ]( this.config[ key ] ) );
				}
			}
		}

		return Promise.all( $promises ).then( () => {
			this.save();
			if( typeof resolve === 'function' ) {
				resolve();
			}
		} );

	}

	/**
	 * Checks if its active or not.
	 * @param $config
	 * @returns {boolean}
	 */
	is_active( $config ) {
		return ( false !== $config );
	}

	/**
	 * Returns Config Values.
	 * @param $type
	 * @param $config
	 * @returns {null|JS_Parse_Args|*}
	 */
	get_config( $type = '', $config = {} ) {
		if( typeof this.gconfig[ $type ] !== 'undefined' ) {
			$config            = ( true === $config ) ? {} : $config;
			let $global_config = this.gconfig[ $type ];
			return parse_args( $config, $global_config, false );
		}
		return ( true === $config ) ? null : $config;
	}

	/**
	 * Saves Files Source.
	 * @returns {*}
	 */
	save() {
		return new Promise( ( resolve ) => {
			if( typeof this.config.rename !== 'undefined' ) {
				log( 'Renaming To ' + this.config.rename );
				this.instance = this.instance.pipe( $rename( this.config.rename ) );
			}

			this.instance = this.instance.pipe( $gulp.dest( get_cwd( this.config.dist ) ) );
			log( 'File Saved In ' + this.config.dist );
			log( ' ' );
			resolve();
		} );
	}

	/**
	 * Triggers SCSS Compile.
	 * @param $arg
	 * @returns {*}
	 */
	scss( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}
		return new Promise( ( resolve ) => {
			log( 'SCSS Start' );
			this.instance = this.instance.pipe( $scss( this.get_config( 'scss', $arg ) ) );
			log( 'SCSS End' );
			resolve();
		} );
	}

	/**
	 * Triggers Autoprefixer Compile.
	 * @param $arg
	 * @returns {*}
	 */
	autoprefixer( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}
		return new Promise( ( resolve ) => {
			log( 'Autoprefixer Start' );
			let $options  = this.get_config( 'autoprefixer', $arg );
			this.instance = this.instance.pipe( $autoprefixer( $options ) )
								.on( 'error', $util.log );
			log( 'Autoprefixer End' );
			resolve();
		} );
	}

	/**
	 * Triggers uglify Compile.
	 * @param $arg
	 * @returns {*}
	 */
	uglify( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}
		return new Promise( ( resolve ) => {
			log( 'Uglify Start' );
			let $options  = this.get_config( 'uglify', $arg );
			this.instance = this.instance.pipe( $uglify( $options ) )
								.on( 'error', $util.log );
			log( 'Uglify End' );
			resolve();
		} );
	}

	/**
	 * Triggers minify Compile.
	 * @param $arg
	 * @returns {*}
	 */
	minify( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}
		return new Promise( ( resolve ) => {
			log( 'Minify Start' );
			let $options  = this.get_config( 'minify', $arg );
			this.instance = this.instance.pipe( $minify_css( $options.options.args, $options.options.callback ) )
								.on( 'error', $util.log );
			log( 'Minify End' );
			resolve();
		} );
	}

	/**
	 * Triggers babel Compile.
	 * @param $arg
	 * @returns {*}
	 */
	babel( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}
		return new Promise( ( resolve ) => {
			log( 'Bable Start' );
			let $options  = this.get_config( 'babel', $arg );
			this.instance = this.instance.pipe( $gbabel( $options ) )
								.on( 'error', $util.log );
			log( 'Babel End' );
			resolve();
		} );
	}

	/**
	 * Triggers Concat Compile.
	 * @param $arg
	 * @returns {*}
	 */
	concat( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}

		return new Promise( ( resolve ) => {
			log( 'Concat Start' );
			let $options = this.get_config( 'concat', $arg );

			if( typeof $options.options === 'object' && typeof $options.options.filename !== 'undefined' ) {
				if( $options.src ) {
					this.instance = this.instance.pipe( $gulp.src( $options.src ) )
										.pipe( $concat( $options.options.filename, $options.options ) )
										.on( 'error', $util.log );
				} else {
					this.instance = this.instance.pipe( $concat( $options.options.filename, $options.options ) )
										.on( 'error', $util.log );
				}

			} else if( typeof $options === 'string' ) {
				this.instance = this.instance.pipe( $concat( $options ) )
									.on( 'error', $util.log );
			}
			log( 'Concat End' );
			resolve();
		} );
	}

	/**
	 * Triggers combine_files  Compile.
	 * @param $arg
	 * @returns {*}
	 */
	combine_files( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}
		return new Promise( ( resolve ) => {
			log( 'Combine Files Start' );
			let $options  = this.get_config( 'combine_files', $arg );
			this.instance = this.instance.pipe( $combine_files( $options ) );
			log( 'Combine Files End' );
			resolve();
		} );
	}

	/**
	 * Triggers webpack  Compile.
	 * @param $arg
	 * @returns {*}
	 */
	webpack( $arg ) {
		if( !this.is_active( $arg ) ) {
			return;
		}

		let $this = this;
		return new Promise( ( resolve ) => {
			log( 'Webpack Start' );
			let $options   = this.get_config( 'webpack', $arg );
			$this.instance = $this.instance.pipe( $revert_path() );
			$this.instance = $this.instance.pipe( $webpack( $options, null, ( a, c ) => {
				$this.instance = $this.instance.pipe( $revert_path() );
				log( 'Webpack End' );
			} ) );
			$this.instance = $this.instance.pipe( $revert_path() );
			resolve();
		} );
	}
}

module.exports = {
	GulpHandler: GulpHandler
};
