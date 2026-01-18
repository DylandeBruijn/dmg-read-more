import { decodeEntities } from '@wordpress/html-entities';

export function stripHtmlTags( string ) {
	const htmlTags = /<[^>]*>?/g;
	return decodeEntities( string ).replace( htmlTags, '' );
}
