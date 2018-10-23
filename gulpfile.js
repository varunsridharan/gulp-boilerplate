const $vs_boilerplate_v = "1.0.0";

const $gulp          = require( 'gulp' ),
	  $util          = require( 'gulp-util' ),
	  $scss          = require( 'gulp-sass' ),
	  $notify        = require( 'gulp-notify' ),
	  $runSequence   = require( 'run-sequence' ),
	  $minify_css    = require( 'gulp-clean-css' ),
	  $concat        = require( 'gulp-concat' ),
	  $autoprefixer  = require( 'gulp-autoprefixer' ),
	  $sourcemaps    = require( 'gulp-sourcemaps' ),
	  $webpack       = require( 'webpack-stream' ),
	  $combine_files = require( 'gulp-combine-files' ),
	  $path          = require( 'path' ),
	  $config        = require( './config.js' );

try {
	const $custom_gulp = require( './gulp-custom.js' );
} catch( e ) {

}

const $defaults_config = $config.default_config,
	  isObject         = obj => obj === Object( obj ),
	  $cwd             = ( $full_path ) => $path.relative( process.cwd(), $full_path ),
	  isUndefined      = val => val === undefined,
	  vs_config_value  = function( $array, $src, $dest ) {
		  if( typeof $dest === "undefined" || $dest === '' ) {
			  let $_src;
			  for( $_src in $array ) {
				  if( $path.normalize( $path.format( $path.parse( $_src ) ) ) === $src || $src === $_src ) {
					  $dest = $array[ $_src ];
					  break;
				  }
			  }
		  }
		  return $dest;
	  },
	  $notice          = ( $notice ) => $gulp.src( '' ).pipe( $notify( $notice ) );

const vs_file_option      = ( $src, $data, $key, $defaults ) => {
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
					  //$return.options = false;
				  }
			  }
		  }

		  return $return;
	  },
	  vs_compile_scss     = function( $_path, $show_alert ) {
		  let $instance = new VS_Gulp( $config.scss, $_path, vs_config_value( $config.scss, $_path ), $show_alert );
		  $instance.sourcemap();
		  $instance.combine_files();
		  $instance.scss();
		  $instance.autoprefixer();
		  $instance.concat();
		  $instance.minify();
		  $instance.sourcemap( true );
		  $instance.save();
		  return $instance;
	  },
	  vs_compile_js       = function( $_path, $show_alert ) {
		  let $instance = new VS_Gulp( $config.js, $_path, vs_config_value( $config.js, $_path ), $show_alert );
		  $instance.combine_files().webpack().concat();
		  $instance.save();
		  return $instance;
	  },
	  vs_compile_all_scss = function( $current_loop ) {
		  const $scss_files_keys = Object.keys( $config.scss );
		  if( false === isUndefined( $scss_files_keys[ $current_loop ] ) ) {
			  vs_compile_scss( $scss_files_keys[ $current_loop ], true )
			  vs_compile_all_scss( $current_loop + 1 );
		  }
	  },
	  vs_compile_all_js   = function( $current_loop ) {
		  const $js_files_keys = Object.keys( $config.js );
		  if( false === isUndefined( $js_files_keys[ $current_loop ] ) ) {
			  vs_compile_js( $js_files_keys[ $current_loop ], true );
			  vs_compile_all_js( $current_loop + 1 );
		  }
	  },
	  VS_Gulp             = function( $vars, $src, $dist, $show_alert ) {
		  this.src      = $src;
		  this.dist     = $dist;
		  this.notices  = '';
		  this.vars     = $vars;
		  this.instance = $gulp.src( this.src );
		  this.alert    = $show_alert;
	  };

VS_Gulp.prototype.gulp_instance = function() {
	return this.instance;
};
VS_Gulp.prototype.notice        = function( $notice ) {
	this.notices += '✓ ' + $notice + '\n';
};
VS_Gulp.prototype.option        = function( $key, $defaults ) {
	return vs_file_option( this.src, this.dist, $key, $defaults );
};
VS_Gulp.prototype.sourcemap     = function( $save ) {
	let $is_save = ( false === isUndefined( $save ) );
	let $options = this.option( 'sourcemap', $defaults_config.sourcemap );

	if( false !== $options.options ) {
		if( false === $is_save ) {
			this.instance = this.instance.pipe( $sourcemaps.init() );
		} else {
			this.instance = this.instance.pipe( $sourcemaps.write() );
			this.notice( 'Sourcemap' );
		}
	}
	return this;
};
VS_Gulp.prototype.combine_files = function() {
	let $options = this.option( 'combine_files', $defaults_config.combine_files );
	if( false !== $options.options ) {
		this.instance = this.instance.pipe( $combine_files( $options.options ) );
		this.notice( 'Files Combined' );
	}
	return this;
};
VS_Gulp.prototype.scss          = function() {
	let $options = this.option( 'scss', $defaults_config.scss );
	if( false !== $options.options ) {
		this.instance = this.instance.pipe( $scss( $options.options ) )
							.on( 'error', function( err ) {
								$notice( err );
							} );
		this.notice( 'SCSS Compiled' );
	}
	return this;
};
VS_Gulp.prototype.autoprefixer  = function() {
	let $options = this.option( 'autoprefixer', $defaults_config.autoprefixer );
	if( false !== $options.options ) {
		this.instance = this.instance.pipe( $autoprefixer( $options.options ) )
							.on( 'error', $util.log );

		this.notice( 'Autoprefixer' );
	}
	return this;

};
VS_Gulp.prototype.concat        = function() {
	let $options = this.option( 'concat', $defaults_config.concat );
	if( false !== $options.options ) {
		if( isObject( $options.options ) && true !== isUndefined( $options.options.filename ) ) {
			if( $options.src ) {
				this.instance = this.instance.pipe( $gulp.src( $options.src ) )
									.pipe( $concat( $options.options.filename, $options.options ) )
									.on( 'error', $util.log );
			} else {
				this.instance = this.instance.pipe( $concat( $options.options.filename, $options.options ) )
									.on( 'error', $util.log );
			}

		} else if( false === isObject( $options.options ) && $options.options !== {} ) {
			this.instance = this.instance.pipe( $concat( $options.options ) )
								.on( 'error', $util.log );
		}
		this.notice( 'Concat' );
	}
	return this;
};
VS_Gulp.prototype.minify        = function() {
	let $options = this.option( 'minify', $defaults_config.minify_css );
	if( false !== $options.options ) {
		this.instance = this.instance.pipe( $minify_css( $options.options.args, $options.options.callback ) )
							.on( 'error', $util.log );
		this.notice( 'Minify' );
	}
	return this;
};
VS_Gulp.prototype.webpack       = function() {
	let $options = this.option( 'webpack', $defaults_config.webpack );
	if( false !== $options.options ) {
		this.instance = this.instance.pipe( $webpack( $options.options ) );
		this.notice( 'Webpack' );
	}
	return this;
};
VS_Gulp.prototype.save          = function() {
	let $dest   = ( isObject( this.dist ) ) ? this.dist.dist : this.dist;
	let $return = this.instance.pipe( $gulp.dest( $dest ) );
	this.notice( 'Saved' );
	if( true === this.alert ) {
		$notice( { title: $config.project_name + ' - ' + this.src, message: this.notices } );
	}
	return $return;
};

// Run Scss Compiler.
$gulp.task( 'scss', ( cb ) => vs_compile_all_scss( 0 ) );
$gulp.task( 'js', ( cb ) => vs_compile_all_js( 0 ) );

// Watch SCSS Files
$gulp.task( 'watch:scss', function( callback ) {
	let $src;
	for( $src in $config.scss ) {
		$gulp.watch( $src, ( a, b ) => vs_compile_scss( $cwd( a[ 'path' ] ), true ) );
		if( true !== isUndefined( $config.scss[ $src ][ 'watch' ] ) ) {
			$gulp.watch( $config.scss[ $src ][ 'watch' ], () => vs_compile_scss( $src, true ) );
		}
	}
	callback();
} );
$gulp.task( 'watch:js', function( callback ) {
	let $src;
	for( $src in $config.js ) {
		$gulp.watch( $src, ( a, b ) => vs_compile_js( $cwd( a[ 'path' ] ), true ) );
		if( true !== isUndefined( $config.js[ $src ][ 'watch' ] ) ) {
			$gulp.watch( $config.js[ $src ][ 'watch' ], () => vs_compile_js( $src, true ) );
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
