import insertHtml from 'parallel-dom/items/Triple/helpers/insertHtml';

export default function Triple$update () {
	var node, parentNode;

	if ( !this.rendered ) return;

	// remove existing nodes
	while ( this.nodes && this.nodes.length ) {
		node = this.nodes.pop();
		node.parentNode.removeChild( node );
	}

	// get new nodes
	this.nodes = insertHtml( this.value, this.parentFragment.getNode(), this.docFrag );

	parentNode = this.parentFragment.getNode();
	parentNode.insertBefore( this.docFrag, this.parentFragment.findNextNode( this ) );

	// Special case - we're inserting the contents of a <select>
	if ( parentNode.tagName === 'SELECT' && parentNode._ractive && parentNode._ractive.binding ) {
		parentNode._ractive.binding.update();
	}
}
