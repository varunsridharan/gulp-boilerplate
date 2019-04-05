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
const $path        = vsp_load_module( 'path' ),
	  $gulp        = vsp_load_module( 'gulp' ),
	  $runSequence = vsp_load_module( 'run-sequence' ),
	  $util        = vsp_load_module( 'gulp-util' ),
	  $notify      = vsp_load_module( 'gulp-notify' ),
	  $revert_path = vsp_load_module( 'gulp-revert-path' );


/**
 * Triggers File Compile.
 * @param $path
 * @param $file_config
 * @returns {GulpHandler}
 */
const compile_file = ( $path, $file_config ) => {
	return new $handler.GulpHandler( get_cwd( $path ), $file_config, $config.config );
};

$gulp.task( 'compilenow', ( cb ) => {
	let $promis = [];
	for( var a in $config.files ) {
		if( typeof $config.files[ a ][ 0 ] === 'object' ) {
			for( var file in $config.files[ a ] ) {
				$promis.push( new Promise( ( resolve, reject ) => {
					let $ins = compile_file( a, $config.files[ a ][ file ] );
					$ins.init( resolve, reject );
					$ins.save();
				} ) );
			}
		} else {
			$promis.push( $gulp.series( new Promise( ( resolve, reject ) => {
				let $ins = compile_file( a, $config.files[ a ] );
				$ins.init( resolve, reject );
				$ins.save();
			} ) ) );

		}
	}

	return Promise.all( $promis ).then( function() {
		return cb();
	} );
} );

