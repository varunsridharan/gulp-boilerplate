/* global async:true */

/**
 * Functions & Basic Needs.
 * @type {string}
 */
const $vs_boilerplate_v = '1.4';

/**
 * Required Imports.
 */
const { handler }    = require( './handler' );
const $gulp          = require( 'gulp' );
const { get_config } = require( './functions' );

$gulp.task( 'watch', ( callback ) => {
	let $config = get_config();

	async function processData( $id, $config, $global ) {
		let $handler = new handler( $id, $config, $global );
		await $handler.init();
	}

	async function watchArray( array, src = null ) {
		for( let $id in array ) {
			if( array.hasOwnProperty( $id ) ) {
				if( array[ $id ] instanceof Array ) {
					for( let $_c in array[ $id ] ) {
						if( array[ $id ].hasOwnProperty( $_c ) ) {
							let $watch = ( true === array[ $id ][ $_c ].watch ) ? $id : array[ $id ][ $_c ].watch;
							$gulp.watch( $watch, { queue: true }, ( cb ) => {
								await processData( $id, array[ $id ][ $_c ], $config.config ).then( () => cb() );
							} );
						}
					}


				} else {
					let $watch = ( true === array[ $id ].watch ) ? $id : array[ $id ].watch;

					$gulp.watch( $watch, { queue: true }, ( cb ) => {
						await processData( $id, array[ $id ], $config.config ).then( () => cb() );
					} );
				}
			}
		}
	}

	if( typeof $config.files !== 'undefined' ) {
		watchArray( $config.files ).then( () => {
			callback();
		} );
	}
} );

$gulp.task( 'call', ( callback ) => {
	let $config = get_config();

	async function processArray( array, src = null ) {
		for( let $id in array ) {
			if( array.hasOwnProperty( $id ) ) {
				if( array[ $id ] instanceof Array ) {
					await processArray( array[ $id ], $id );
				} else {
					let $_src    = ( null === src ) ? $id : src;
					let $handler = new handler( $_src, array[ $id ], $config.config );
					await $handler.init();
				}
			}
		}
	}

	if( typeof $config.files !== 'undefined' ) {
		processArray( $config.files ).then( () => {
			callback();
		} );
	}
} );