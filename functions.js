/* global process:true */
const $current_path = process.cwd();

/**
 * Handles Parsing JS Args.
 */
class JS_Parse_Args {
	constructor( $args = {}, $defaults = {}, $is_nested = false ) {
		this.args     = $args;
		this.defaults = $defaults;
		this.nested   = $is_nested;
		this.parse();
		return this.args;
	}

	parse() {
		for( let $_key in this.defaults ) {
			if( this.defaults.hasOwnProperty( $_key ) ) {
				if( true === this.nested && typeof this.defaults[ $_key ] === 'object' ) {
					this.args[ $_key ] = new JS_Parse_Args( this.args[ $_key ], this.defaults[ $_key ], this.nested );
				} else {
					if( typeof this.args[ $_key ] === 'undefined' ) {
						this.args[ $_key ] = this.defaults[ $_key ];
					}
				}
			}
		}
	}
}

/**
 * Parses Args.
 * @param $args
 * @param $defaults
 * @param $is_deep
 * @returns {JS_Parse_Args}
 */
const parse_args = ( $args = {}, $defaults = {}, $is_deep = false ) => new JS_Parse_Args( $args, $defaults, $is_deep );

/**
 * Loads A Module.
 * @param $module
 * @param $defaults
 * @returns {boolean|*}
 */
const vsp_load_module = ( $module, $defaults = false ) => {
	try {
		$module = require( $module );
	} catch( e ) {
		return $defaults;
	}
	return $module;
};

/**
 * Returns Config JSON.
 * @returns {boolean|*}
 */
const get_user_config = () => {
	let $config = vsp_load_module( $current_path + '/config.js' );
	if( false === $config ) {
		$config = vsp_load_module( $current_path + '/gulp-config.js' );
	}
	return $config;
};

/**
 * Returns Default Config.
 * @type {boolean|*}
 */
const get_default_config = vsp_load_module( './default-config.js' );

/**
 * Returns Final Config.
 */
const get_config = () => {
	let $config        = get_user_config();
	let $default       = get_default_config;
	let $new_config    = {};
	$new_config.files  = $config.files;
	$new_config.config = parse_args( $config.config, $default.config, false );
	return $new_config;
};

module.exports = {
	get_config: get_config,
	vsp_load_module: vsp_load_module,
	parse_args: parse_args,
	current_path: $current_path,
};