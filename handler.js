const { vsp_load_module, get_cwd, parse_args } = require( './functions' );

/**
 * Required Imports.
 */
const $path          = vsp_load_module( 'path' ),
	  $gulp          = vsp_load_module( 'gulp' ),
	  $runSequence   = vsp_load_module( 'run-sequence' ),
	  $rename        = vsp_load_module( 'gulp-rename' ),
	  $util          = vsp_load_module( 'gulp-util' ),
	  $scss          = vsp_load_module( 'gulp-sass' ),
	  $minify_css    = vsp_load_module( 'gulp-clean-css' ),
	  $gbabel        = vsp_load_module( 'gulp-babel' ),
	  $concat        = vsp_load_module( 'gulp-concat' ),
	  $uglify        = vsp_load_module( 'gulp-uglify' ),
	  $autoprefixer  = vsp_load_module( 'gulp-autoprefixer' ),
	  $sourcemaps    = vsp_load_module( 'gulp-sourcemaps' ),
	  $combine_files = vsp_load_module( 'gulp-combine-files' ),
	  $revert_path   = vsp_load_module( 'gulp-revert-path' ),
	  $webpack       = vsp_load_module( 'webpack-stream' );

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
		this.instance = this.instance.on( 'error', reject );
		let $promise  = [];
		for( let key in this.config ) {
			if( GulpHandler.prototype[ key ] !== undefined && 'function' === typeof GulpHandler.prototype[ key ] ) {
				this[ key ]( this.config[ key ] );
			}
		}
		this.instance = this.instance.on( 'end', resolve );
		return this.instance;
		//return Promise.all( $promise );
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
		if( typeof this.config.rename !== 'undefined' ) {
			this.instance = this.instance.pipe( $rename( this.config.rename ) );
		}

		this.instance = this.instance.pipe( $gulp.dest( get_cwd( this.config.dist ) ) );

		return this.instance;
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
		this.instance = this.instance.pipe( $scss( this.get_config( 'scss', $arg ) ) );
		return this.instance;
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
		let $options  = this.get_config( 'autoprefixer', $arg );
		this.instance = this.instance.pipe( $autoprefixer( $options ) )
							.on( 'error', $util.log );
		return this.instance;
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
		let $options  = this.get_config( 'uglify', $arg );
		this.instance = this.instance.pipe( $uglify( $options ) )
							.on( 'error', $util.log );
		return this.instance;
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
		let $options  = this.get_config( 'minify', $arg );
		this.instance = this.instance.pipe( $minify_css( $options.options.args, $options.options.callback ) )
							.on( 'error', $util.log );
		return this.instance;
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
		let $options  = this.get_config( 'babel', $arg );
		this.instance = this.instance.pipe( $gbabel( $options ) )
							.on( 'error', $util.log );
		return this.instance;
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
		return this.instance;
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

		let $options  = this.get_config( 'combine_files', $arg );
		this.instance = this.instance.pipe( $combine_files( $options ) );
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
		let $options  = this.get_config( 'webpack', $arg );
		this.instance = this.instance.pipe( $revert_path() );
		let $web_pack = $webpack( $options );
		this.instance = this.instance.pipe( $web_pack );
		this.instance = this.instance.pipe( $revert_path() );

	}
}

module.exports = {
	GulpHandler: GulpHandler
};