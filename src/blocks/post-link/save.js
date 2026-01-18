import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { postTitle, postUrl } = attributes;

	const anchorText = postTitle ? `Read More: ${ postTitle }` : 'Read More';

	return (
		<p { ...useBlockProps.save( { className: 'dmg-read-more' } ) }>
			<a href={ postUrl }>{ anchorText }</a>
		</p>
	);
}
