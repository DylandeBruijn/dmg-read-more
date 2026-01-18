import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import Pagination from './Pagination';
import { stripHtmlTags } from './helpers';

export default function PostsList( {
	posts,
	onPostSelect,
	isSearching,
	currentPage,
	totalPages,
	onPageChange,
} ) {
	return (
		<>
			<span
				style={ {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 500,
				} }
			>
				{ isSearching
					? __( 'Found Posts:', 'dmg-read-more' )
					: __( 'Recent Posts:', 'dmg-read-more' ) }
			</span>
			<ul style={ { margin: 0 } }>
				{ posts.map( ( post ) => (
					<li key={ post.id } style={ { margin: 0 } }>
						<Button
							variant="link"
							onClick={ () => onPostSelect( post ) }
							style={ { height: 'fit-content' } }
						>
							{ stripHtmlTags( post.title.rendered ) ||
								__( '(No title)', 'dmg-read-more' ) }
						</Button>
					</li>
				) ) }
			</ul>
			{ totalPages > 1 && isSearching && (
				<Pagination
					currentPage={ currentPage }
					totalPages={ totalPages }
					onPageChange={ onPageChange }
				/>
			) }
		</>
	);
}
