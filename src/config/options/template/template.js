import baseConfig from 'config/options/baseConfiguration';
import parser from 'config/options/template/parser';
import isObject from 'utils/isObject';
import parseOptions from 'config/options/groups/parseOptions';

var templateConfig = baseConfig({
	name: 'template',
	useDefaults: true,
	defaultValue: '',
	extendValue: extend,
	postExtend: parseTemplate,
	initValue: init,
	postInit: parseTemplate,
	resetValue: reset,
	processCompound: processCompound
});

function extend ( target, parentValue, value ) {

	if ( typeof value === 'undefined' ) { value = parentValue; }

	return value;
}

function init ( ractive, parentValue, value ) {

	var result = extend( ractive, parentValue, value );

	if ( typeof result === 'function' ) {

		let fn = result;

		result = getDynamicTemplate( ractive, fn );

		// store fn and fn result for reset
		ractive._config[ this.name ] = {
			fn: fn,
			result: result
		};
	}

	return result;
}

function getDynamicTemplate ( ractive, fn ) {
	var helper = parser.createHelper( getParseOptions( ractive ) );
	return fn.call( ractive, ractive.data, helper );
}

function reset ( ractive ) {

	var initial = ractive._config.template, result;

	// is this dynamic template?
	if( !initial || !initial.fn) { return; }

	result = getDynamicTemplate ( ractive, initial.fn )

	// compare results of fn return, which is likely
	// be string comparison ( not yet parsed )
	if ( result !== initial.result ) {
		initial.result = result;
		return result;
	}
}

function getParseOptions ( target ) {

	if ( target.parseOptions ) { return target.parseOptions; }

	var options = target.defaults;

	if ( !options ) { return; }

	return parseOptions.reduce( ( val, option ) => {
		val[ option.name ] = options[ option.name ];
		return val;
	}, {} );

}

function parseTemplate ( target, template ) {

	if ( !template ) { return template; }

	if ( !parser.isParsed( template ) ) {

		// Assume this is an ID of a <script type='text/ractive'> tag
		if ( parser.isHashedId( template ) ) {
			template = parser.fromId( template );
		}

		template = parser.parse( template, getParseOptions( target ) );
	}

	template = processCompound( target, template );

	// If the template was an array with a single string member, that means
	// we can use innerHTML - we just need to unpack it
	if ( template && ( template.length === 1 ) && ( typeof template[0] === 'string' ) ) {
		template = template[0];
	}

	return template;
}

function processCompound( target, template ) {

	if ( !isObject( template ) ) { return template; }

	target.partials = target.partials || {};

	for ( let key in template.partials ) {
		target.partials[ key ] = template.partials[ key ];
	}

	return template.main
}

export default templateConfig;
