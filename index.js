/**
 * Functions & Basic Needs.
 * @type {string}
 */
const $vs_boilerplate_v                        = '1.4';
const { vsp_load_module, get_config, get_cwd } = require( './functions' );
const $config                                  = get_config();
const $handler                                 = vsp_load_module( './handler.js' );


/**
 * Required Imports.
 */
const $gulp = vsp_load_module( 'gulp' );


/**
 * Triggers File Compile.
 * @param $path
 * @param $file_config
 * @returns {GulpHandler}
 */
const compile_file = ( $path, $file_config ) => {
	return new $handler.GulpHandler( get_cwd( $path ), $file_config, $config.config );
};

$gulp.task( 'watch', ( cb ) => {
	for( var a in $config.files ) {
		if( $config.files.hasOwnProperty( a ) ) {
			if( typeof $config.files[ a ][ 0 ] === 'object' ) {
				let $watch = false;
				for( var file in $config.files[ a ] ) {
					if( $config.files[ a ].hasOwnProperty( file ) ) {
						if( typeof $config.files[ a ][ file ].watch !== 'undefined' ) {
							$watch = $config.files[ a ][ file ].watch;
						}
					}
				}

				if( $watch ) {
					$gulp.watch( $watch ).on( 'all', () => {
						for( var file in $config.files[ a ] ) {
							if( $config.files[ a ].hasOwnProperty( file ) ) {
								let $ins = compile_file( a, $config.files[ a ][ file ] );
								$ins.init( undefined, undefined );
								$ins.save();
							}
						}
					} );
				}
			} else {
				if( typeof $config.files[ a ].watch !== 'undefined' ) {
					$gulp.watch( $config.files[ a ].watch ).on( 'all', () => {
						let $ins = compile_file( a, $config.files[ a ] );
						$ins.init( undefined, undefined );
						$ins.save();
					} );
				}
			}
		}
		cb();
	}
} );

$gulp.task( 'compile', ( cb ) => {
	let $promis = [];
	for( var a in $config.files ) {
		if( $config.files.hasOwnProperty( a ) ) {
			if( typeof $config.files[ a ][ 0 ] === 'object' ) {
				for( var file in $config.files[ a ] ) {
					if( $config.files[ a ].hasOwnProperty( file ) ) {
						$promis.push( new Promise( ( resolve, reject ) => {
							let $ins = compile_file( a, $config.files[ a ][ file ] );
							$ins.init( resolve, reject );
							$ins.save();
						} ) );
					}
				}
			} else {
				$promis.push( new Promise( ( resolve, reject ) => {
					let $ins = compile_file( a, $config.files[ a ] );
					$ins.init( resolve, reject );
					$ins.save();
				} ) );

			}
		}
	}

	return Promise.all( $promis ).then( function() {
		return cb();
	} );
} );

