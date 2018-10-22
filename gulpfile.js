/**
 * Required Functions To Run.
 * @type {Gulp}
 */
let $gulp          = require( 'gulp' ),
	$util          = require( 'gulp-util' ),
	$scss          = require( 'gulp-sass' ),
	$notify        = require( 'gulp-notify' ),
	$runSequence   = require( 'run-sequence' ),
	$minify_css    = require( 'gulp-clean-css' ),
	$concat        = require( 'gulp-concat' ),
	$autoprefixer  = require( 'gulp-autoprefixer' ),
	$sourcemaps    = require( 'gulp-sourcemaps' ),
	$config        = require( './config.js' ),
	$webpack       = require( 'webpack-stream' ),
	$combine_files = require( 'gulp-combine-files' ),
	$path          = require( 'path' );

/**
 * Basic Configs. & Help Functions
 */
const $defaults_config = $config.default_config,
	  $global          = { notices: "", scss: { src: '', dist: '' }, js: { src: '', dist: '' } },
	  isObject         = obj => obj === Object( obj ),
	  $cwd             = ( $full_path ) => $path.relative( process.cwd(), $full_path ),
	  isUndefined      = val => val === undefined,
	  merge            = ( ...objs ) => [ ...objs ].reduce( ( acc, obj ) => Object.keys( obj ).reduce( ( a, k ) => {
		  acc[ k ] = acc.hasOwnProperty( k ) ? [].concat( acc[ k ] )
												 .concat( obj[ k ] ) : obj[ k ];
		  return acc;
	  }, {} ), {} );

// Basic Gulp Handler.
let $vs_gulp = {
	get_file_data: ( $array, $src, $dest ) => {
		if( typeof $dest === "undefined" || $dest === '' ) {
			let $_src;
			for( $_src in $array ) {
				if( $path.normalize( $path.format( $path.parse( $_src ) ) ) === $src ) {
					$dest = $array[ $_src ];
					break;
				}
			}
		}
		return $dest;
	},
	notice: ( $notice ) => $gulp.src( '' ).pipe( $notify( $notice ) ),
	get_option: ( $src, $data, $key, $defaults ) => {
		let $return = { src: $src, options: $defaults, dist: $data };
		if( false === isUndefined( $data ) && true === isObject( $data ) ) {
			$return.dist = $data.dist;
		} else if( false === isUndefined( $data ) && false === isObject( $data ) && false !== $data ) {
			$return.dist = $data;
		}

		if( false === isUndefined( $data ) ) {
			if( isObject( $data ) ) {
				if( false === isUndefined( $data[ $key ] ) ) {
					let $_d = $data[ $key ];
					if( false === $_d ) {
						$return.options = false;
					} else {
						if( true === $_d ) {
							$_d = {};
						} else if( false === $_d ) {
							$_d = false;
						}

						let $dist = $return.dist;
						if( false === isUndefined( $_d.dist ) ) {
							$dist = $_d.dist;
							delete $_d[ 'dist' ];
						}

						if( false === isUndefined( $_d.src ) ) {
							$return.src = $_d.src;
							delete $_d[ 'src' ];
						}
						let $k;
						for( $k in $defaults ) {
							if( isUndefined( $_d[ $k ] ) ) {
								$_d[ $k ] = $defaults[ $k ];
							}
						}

						$return.options = $_d;
						$return.dist    = $dist;
					}
				} else {
					$return.options = false;
				}
			}
		}

		return $return;
	},
	scss_files_loop: ( $current_loop ) => {
		const $scss_files_keys = Object.keys( $config.scss );
		if( false === isUndefined( $scss_files_keys[ $current_loop ] ) ) {
			$global.scss.src  = $scss_files_keys[ $current_loop ];
			$global.scss.dist = $config.scss[ $scss_files_keys[ $current_loop ] ];
			$runSequence( 'scss:single', function() {
				$vs_gulp.scss_files_loop( $current_loop + 1 );
			} );
		}
	},
	js_files_loop: ( $current_loop ) => {
		const $js_files_keys = Object.keys( $config.js );
		if( false === isUndefined( $js_files_keys[ $current_loop ] ) ) {
			$global.js.src  = $js_files_keys[ $current_loop ];
			$global.js.dist = $config.js[ $js_files_keys[ $current_loop ] ];
			$runSequence( 'scss:single', function() {
				$vs_gulp.js_files_loop( $current_loop + 1 );
			} );
		}
	},
};

// SCSS Single File Compile.
$gulp.task( 'scss:single', ( cb ) => {
	let $_dest = $vs_gulp.get_file_data( $config.scss, $global.scss.src, $global.scss.dist );
	let $ins   = $gulp.src( $global.scss.src );

	/**
	 * Source Map Handler.
	 * @type {*|{src: *, options: *, dist: *}}
	 */
	let $source_map = $vs_gulp.get_option( $global.scss.src, $global.scss.dist, 'sourcemap', $defaults_config.sourcemap );
	if( false !== $source_map.options ) {
		$ins.pipe( $sourcemaps.init() );
	}

	/**
	 * Combine Files Handler.
	 * @type {*|{src: *, options: *, dist: *}|{src, options, dist}}
	 */
	let $_combine_files = $vs_gulp.get_option( $global.scss.src, $global.scss.dist, 'combine_files', $defaults_config.combine_files );
	if( false !== $_combine_files.options ) {
		$ins = $ins.pipe( $combine_files( $_combine_files.options ) );
		$global.notices += '✓ Files Combined \n';
	}

	/**
	 * SCSS Handler.
	 * @type {*|{src: *, options: *, dist: *}}
	 */
	let $scss_arg = $vs_gulp.get_option( $global.scss.src, $global.scss.dist, 'scss', $defaults_config.scss );
	if( false !== $scss_arg.options ) {
		$ins = $ins.pipe( $scss( $scss_arg.options ) )
				   .on( 'error', function( err ) {
					   $vs_gulp.notice( err );
				   } );

		$global.notices += '✓ SCSS Compiled \n';
	}

	/**
	 * AutoPrefixer Handler.
	 * @type {*|{src: *, options: *, dist: *}}
	 */
	let $_autoprefixer = $vs_gulp.get_option( $global.scss.src, $global.scss.dist, 'autoprefixer', $defaults_config.autoprefixer );
	if( false !== $_autoprefixer.options ) {
		$ins = $ins.pipe( $autoprefixer( $_autoprefixer.options ) )
				   .on( 'error', $util.log );

		$global.notices += '✓ Autoprefixer \n';
	}

	/**
	 * Concat Handler.
	 * @type {*|{src: *, options: *, dist: *}}
	 */
	let $_concat = $vs_gulp.get_option( $global.scss.src, $global.scss.dist, 'concat', $defaults_config.concat );
	if( false !== $_concat.options ) {
		if( isObject( $_concat.options ) && true !== isUndefined( $_concat.options.filename ) ) {
			if( $_concat.src ) {
				$ins = $ins.pipe( $gulp.src( $_concat.src ) )
						   .pipe( $concat( $_concat.options.filename, $_concat.options ) )
						   .on( 'error', $util.log );
			} else {
				$ins = $ins.pipe( $concat( $_concat.options.filename, $_concat.options ) ).on( 'error', $util.log );
			}

		} else if( false === isObject( $_concat.options ) && $_concat.options !== {} ) {
			$ins = $ins.pipe( $concat( $_concat.options ) )
					   .on( 'error', $util.log );
		}
		$global.notices += '✓ Concat \n';
	}


	/**
	 * Minify Handler.
	 * @type {*|{src: *, options: *, dist: *}}
	 */
	let $minify = $vs_gulp.get_option( $global.scss.src, $global.scss.dist, 'minify', $defaults_config.minify_css );
	if( false !== $minify.options ) {
		$ins = $ins.pipe( $minify_css( $minify.options.args, $minify.options.callback ) )
				   .on( 'error', $util.log );
		$global.notices += '✓ Minify \n';
	}

	/**
	 * Source map Handler.
	 */
	if( false !== $source_map.options ) {
		$ins.pipe( $sourcemaps.write() );
		$global.notices += '✓ SourceMap \r';
	}

	if( isObject( $global.scss.dist ) ) {
		return $ins.pipe( $gulp.dest( $global.scss.dist.dist ) );
	} else {
		return $ins.pipe( $gulp.dest( $global.scss.dist ) );
	}
} );

// Run Scss Compiler.
$gulp.task( 'scss', ( cb ) => {
	$vs_gulp.scss_files_loop( 0 );
	cb();
} );

// Run JS Compiler.
$gulp.task( 'scss', ( cb ) => {
	$vs_gulp.js_files_loop( 0 );
	cb();
} );

//JS Single File Compile.
$gulp.task( 'js:single', ( cb ) => {
	let $_webpack       = $vs_gulp.get_option( $global.js.src, $global.js.dist, 'webpack', $defaults_config.webpack );
	let $_combine_files = $vs_gulp.get_option( $global.js.src, $global.js.dist, 'combine_files', $defaults_config.combine_files );
	let $ins            = $gulp.src( $global.js.src );

	if( false !== $_combine_files.options ) {
		$ins = $ins.pipe( $combine_files( $_combine_files.options ) );
		$global.notices += '✓ Combine Files \r';
	}

	if( false !== $_webpack.options ) {
		$ins = $ins.pipe( $webpack( $_webpack.options ) );
		$global.notices += '✓ Webpack \r';
	}

	if( isObject( $global.js.dist ) ) {
		return $ins.pipe( $gulp.dest( $global.js.dist.dist ) );
	} else {
		return $ins.pipe( $gulp.dest( $global.js.dist ) );
	}

} );

// Watch SCSS Files
$gulp.task( 'watch:scss', function( callback ) {
	let $src;
	for( $src in $config.scss ) {
		let $_src = false;
		if( false === isUndefined( $config.scss[ $src ][ 'watch' ] ) ) {
			$_src = $config.scss[ $src ][ 'watch' ];
		}

		$gulp.watch( $src, function( a, b ) {
			$global.scss.src  = $cwd( a[ 'path' ] );
			$global.scss.dist = $vs_gulp.get_file_data( $config.scss, $cwd( a[ 'path' ] ) );
			$runSequence( 'scss:single', function() {
				$vs_gulp.notice( {
					title: $global.scss.src,
					message: $global.notices
				} );
			} );
		} );

		if( false !== $_src ) {
			let $s;
			for( $s in $_src ) {
				$gulp.watch( $_src[ $s ], function( a, b ) {
					$global.scss.src  = $src;
					$global.scss.dist = $vs_gulp.get_file_data( $config.scss, $src );
					$runSequence( 'scss:single', function() {
						$vs_gulp.notice( {
							title: $global.scss.src,
							message: $global.notices
						} );
					} );
				} );
			}

		}
	}
	callback();
} );

// Watch JS Files
$gulp.task( 'watch:js', function( callback ) {
	let $src;
	for( $src in $config.js ) {
		let $_src = false;
		if( false === isUndefined( $config.js[ $src ][ 'watch' ] ) ) {
			$_src = $config.js[ $src ][ 'watch' ];
		}

		$gulp.watch( $src, function( a, b ) {
			$global.js.src  = $cwd( a[ 'path' ] );
			$global.js.dist = $vs_gulp.get_file_data( $config.js, $cwd( a[ 'path' ] ) );
			$runSequence( 'js:single', function() {
				$vs_gulp.notice( {
					title: $config.project_name + " - " + $global.js.src,
					message: $global.notices
				} );
			} );
		} );

		if( false !== $_src ) {
			let $s;
			for( $s in $_src ) {
				$gulp.watch( $_src[ $s ], function( a, b ) {
					$global.js.src  = $src;
					$global.js.dist = $vs_gulp.get_file_data( $config.js, $src );
					$runSequence( 'js:single', function() {
						$vs_gulp.notice( {
							title: $config.project_name + " - " + $global.js.src,
							message: $global.notices
						} );
					} );
				} );
			}

		}
	}
	callback();

} );

//Triggers A Watch Action
$gulp.task( 'watch', function( callback ) {
	$runSequence( 'watch:scss' );
	$runSequence( 'watch:js' );
	callback();
} );
