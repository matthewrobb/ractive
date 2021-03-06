import startsWithKeypath from 'virtualdom/items/shared/utils/startsWithKeypath';

export default function getNewKeypath( targetKeypath, oldKeypath, newKeypath ) {
	// exact match
	if ( targetKeypath === oldKeypath ) {
		return newKeypath;
	}

	// partial match based on leading keypath segments
	if ( startsWithKeypath( targetKeypath, oldKeypath ) ){
		return targetKeypath.replace( oldKeypath + '.', newKeypath + '.' );
	}
}
