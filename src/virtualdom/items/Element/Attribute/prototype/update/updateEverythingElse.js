export default function Attribute$updateEverythingElse () {
	var node, name, value;

	node = this.node;
	name = this.name;
	value = this.value;

	if ( this.namespace ) {
		node.setAttributeNS( this.namespace, name, value );
	}

	else if ( typeof value === 'string' || typeof value === 'number' ) {
		node.setAttribute( name, value );
	}

	// Boolean attributes - truthy becomes '', falsy means 'remove attribute'
	else {
		if ( value ) {
			node.setAttribute( name, '' );
		} else {
			node.removeAttribute( name );
		}
	}
}
