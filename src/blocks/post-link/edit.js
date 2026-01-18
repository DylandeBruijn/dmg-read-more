import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SearchControl,
	Spinner,
	Button,
	RadioControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useDebouncedInput } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';
import Pagination from './Pagination';
import './editor.scss';

const SEARCH_TYPE = {
	TITLE: 'title',
	ID: 'id',
};

export default function Edit( { attributes, setAttributes } ) {
	const { postTitle, postUrl } = attributes;
	const [ searchTerm, setSearchTerm, debouncedSearchTerm ] =
		useDebouncedInput( '' );
	const [ searchType, setSearchType ] = useState( SEARCH_TYPE.TITLE );
	const [ currentPage, setCurrentPage ] = useState( 1 );

	useEffect( () => {
		setCurrentPage( 1 );
	}, [ debouncedSearchTerm, searchType ] );

	const { posts, totalPages, isResolving } = useSelect(
		( select ) => {
			const {
				getEntityRecords,
				getEntityRecordsTotalPages,
				isResolving: checkResolving,
			} = select( 'core' );

			const query = {
				status: 'publish',
				per_page: 5,
				page: currentPage,
				_fields: [ 'id', 'title', 'link' ],
			};

			if ( ! debouncedSearchTerm ) {
				query.orderby = 'date';
				query.order = 'desc';

				return {
					posts: getEntityRecords( 'postType', 'post', query ) || [],
					totalPages:
						getEntityRecordsTotalPages(
							'postType',
							'post',
							query
						) || 1,
					isResolving: checkResolving( 'getEntityRecords', [
						'postType',
						'post',
						query,
					] ),
				};
			}

			if ( searchType === SEARCH_TYPE.ID ) {
				const isNumeric = /^\d+$/.test( debouncedSearchTerm );

				if ( ! isNumeric ) {
					return { posts: [], totalPages: 1, isResolving: false };
				}

				query.include = [ parseInt( debouncedSearchTerm ) ];
			}

			if ( searchType === SEARCH_TYPE.TITLE ) {
				query.search = debouncedSearchTerm;
			}

			return {
				posts: getEntityRecords( 'postType', 'post', query ) || [],
				totalPages:
					getEntityRecordsTotalPages( 'postType', 'post', query ) ||
					1,
				isResolving: checkResolving( 'getEntityRecords', [
					'postType',
					'post',
					query,
				] ),
			};
		},
		[ debouncedSearchTerm, searchType, currentPage ]
	);

	const handlePostUnlink = () => {
		setAttributes( { postId: '', postTitle: '', postUrl: '#' } );
		setSearchTerm( '' );
	};

	const handlePostSelect = ( selectedPost ) => {
		setAttributes( {
			postId: selectedPost.id,
			postTitle: selectedPost.title.rendered,
			postUrl: selectedPost.link,
		} );
		setSearchTerm( '' );
	};

	const linkText = postTitle ? `Read More: ${ postTitle }` : 'Read More';

	return (
		<>
			<InspectorControls>
				<PanelBody title="Settings" initialOpen={ true }>
					{ postTitle && (
						<div
							style={ {
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '16px',
								gap: '16px',
							} }
						>
							<div
								style={ {
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
								} }
							>
								<span style={ { fontWeight: 500 } }>
									{ __( 'Selected Post:', 'dmg-read-more' ) }
								</span>{ ' ' }
								<span>{ postTitle }</span>
							</div>
							<Button
								variant="link"
								onClick={ handlePostUnlink }
								style={ { height: 'fit-content' } }
							>
								Unlink
							</Button>
						</div>
					) }
					<RadioControl
						label={ __( 'Search By', 'dmg-read-more' ) }
						selected={ searchType }
						options={ [
							{ label: 'Title', value: SEARCH_TYPE.TITLE },
							{ label: 'ID', value: SEARCH_TYPE.ID },
						] }
						onChange={ setSearchType }
					/>
					<SearchControl
						label={ __( 'Search Posts', 'dmg-read-more' ) }
						value={ searchTerm }
						onChange={ setSearchTerm }
						placeholder={
							searchType === SEARCH_TYPE.ID
								? __( 'Search for a post ID…', 'dmg-read-more' )
								: __(
										'Search for a post title…',
										'dmg-read-more'
								  )
						}
					/>
					{ isResolving && <Spinner /> }
					{ ! isResolving && posts.length > 0 && (
						<>
							<span
								style={ {
									display: 'block',
									marginBottom: '8px',
									fontWeight: 500,
								} }
							>
								{ debouncedSearchTerm
									? __( 'Found Posts:', 'dmg-read-more' )
									: __( 'Recent Posts:', 'dmg-read-more' ) }
							</span>
							<ul style={ { margin: 0 } }>
								{ posts.map( ( post ) => (
									<li key={ post.id } style={ { margin: 0 } }>
										<Button
											variant="link"
											onClick={ () =>
												handlePostSelect( post )
											}
											style={ { height: 'fit-content' } }
										>
											{ post.title.rendered ||
												__(
													'(No title)',
													'dmg-read-more'
												) }
										</Button>
									</li>
								) ) }
							</ul>
							{ totalPages > 1 && debouncedSearchTerm && (
								<Pagination
									currentPage={ currentPage }
									totalPages={ totalPages }
									onPageChange={ setCurrentPage }
								/>
							) }
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<p { ...useBlockProps( { className: 'dmg-read-more' } ) }>
				<a href={ postUrl }>{ linkText }</a>
			</p>
		</>
	);
}
