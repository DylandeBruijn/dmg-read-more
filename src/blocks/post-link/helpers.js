import { decodeEntities } from '@wordpress/html-entities';

export function stripHtmlTags( string ) {
	const htmlTags = /<[^>]*>?/g;
	return decodeEntities( string ).replace( htmlTags, '' );
}

export function truncate( string, maxWords ) {
	if ( typeof string !== 'string' ) {
		return '';
	}

	const words = string.trim().split( /\s+/ );

	if ( words.length <= maxWords ) {
		return string;
	}

	return words.slice( 0, maxWords ).join( ' ' ) + '…';
}
