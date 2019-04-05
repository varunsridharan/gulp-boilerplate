var _     = require( 'lodash' );
var $path = require( 'path' );

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

/**
 * Parses Args.
 * @param $args
 * @param $defaults
 * @param $is_deep
 * @returns {JS_Parse_Args}
 */
const parse_args = ( $args = {}, $defaults = {}, $is_deep = false ) => new JS_Parse_Args( $args, $defaults, $is_deep );

/**
 * Loads VSP Modules.
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
 * Returns Current Working Directory
 * @returns {string}
 */
const get_cwd = ( $full_path = '' ) => process.cwd() + '/' + $full_path;

/**
 * Returns Sample Config.
 * @returns {boolean|*}
 */
const get_sample_config = () => vsp_load_module( './sample-config.js' );

/**
 * Returns Projects Config Info.
 * @returns {boolean|*}
 */
const get_user_config = () => vsp_load_module( get_cwd( 'gulp-config.js' ) );

/**
 * Returns Proper Config Data For Gulp.
 */
const get_config = () => {
	let $sample_config       = get_sample_config();
	let $user_config         = get_user_config();
	let $new_config          = {};
	$new_config.project_name = ( typeof $user_config.project_name !== 'undefined' ) ? $user_config.project_name : null;
	$new_config.config       = parse_args( $user_config.config, $sample_config.config, false );
	$new_config.files        = $user_config.files;
	return $new_config;
};

module.exports = {
	vsp_load_module: vsp_load_module,
	get_cwd: ( a ) => get_cwd( a ),
	get_sample_config: get_sample_config,
	get_config: get_config,
	parse_args: parse_args,
};