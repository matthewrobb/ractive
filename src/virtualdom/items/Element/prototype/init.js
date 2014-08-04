import types from 'config/types';
import enforceCase from 'virtualdom/items/Element/shared/enforceCase';
import createAttributes from 'virtualdom/items/Element/prototype/init/createAttributes';
import createTwowayBinding from 'virtualdom/items/Element/prototype/init/createTwowayBinding';
import createEventHandlers from 'virtualdom/items/Element/prototype/init/createEventHandlers';
import Decorator from 'virtualdom/items/Element/Decorator/_Decorator';
import bubbleSelect from 'virtualdom/items/Element/special/select/bubble';
import initOption from 'virtualdom/items/Element/special/option/init';
import getComponent from 'virtualdom/items/Component/getComponent';
import Component from 'virtualdom/items/Component/_Component';

import circular from 'circular';

var Fragment;

circular.push( function () {
	Fragment = circular.Fragment;
});

export default function Element$init ( options ) {
	var parentFragment,
		template,
		ractive,
		Custom,
		binding,
		bindings;

	this.type = types.ELEMENT;

	// stuff we'll need later
	parentFragment = this.parentFragment = options.parentFragment;
	template = this.template = options.template;

	this.parent = options.pElement || parentFragment.pElement;

	this.root = ractive = parentFragment.root;
	this.index = options.index;

	this.name = enforceCase( template.e );

	// Special case - <option> elements
	if ( this.name === 'option' ) {
		initOption( this, template );
	}

	// Special case - <select> elements
	if ( this.name === 'select' ) {
		this.options = [];
		this.bubble = bubbleSelect; // TODO this is a kludge
	}

	// create attributes
	this.attributes = createAttributes( this, template.a );

	// append children, if there are any
	if( ( Custom = getComponent( options.parentFragment.root, options.template.e ) ) || template.f ) {
		this.fragment = new Fragment({
			template: Custom ? [] : template.f,
			root:     ractive,
			owner:    this,
			pElement: this
		});

		if( Custom ) {
			this.fragment.items.push( new Component( {
				template:       template,
				parentFragment: this.fragment,
				index:          0,
				pElement:       this
			}, Custom ) );
		}
	}

	// create twoway binding
	if ( ractive.twoway && ( binding = createTwowayBinding( this, template.a ) ) ) {
		this.binding = binding;

		// register this with the root, so that we can do ractive.updateModel()
		bindings = this.root._twowayBindings[ binding.keypath ] || ( this.root._twowayBindings[ binding.keypath ] = [] );
		bindings.push( binding );
	}

	// create event proxies
	if ( template.v ) {
		this.eventHandlers = createEventHandlers( this, template.v );
	}

	// create decorator
	if ( template.o ) {
		this.decorator = new Decorator( this, template.o );
	}

	// create transitions
	this.intro = template.t0 || template.t1;
	this.outro = template.t0 || template.t2;
}
