import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RadioControl,
	SearchControl,
	Spinner,
} from '@wordpress/components';
import { useDebouncedInput } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

import { SEARCH_TYPE } from './constants';
import SelectedPost from './SelectedPost';
import PostsList from './PostsList';
import './editor.scss';

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
						<SelectedPost
							postTitle={ postTitle }
							onUnlink={ handlePostUnlink }
						/>
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
						<PostsList
							posts={ posts }
							onPostSelect={ handlePostSelect }
							isSearching={ !! debouncedSearchTerm }
							currentPage={ currentPage }
							totalPages={ totalPages }
							onPageChange={ setCurrentPage }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<p { ...useBlockProps( { className: 'dmg-read-more' } ) }>
				<a href={ postUrl }>{ linkText }</a>
			</p>
		</>
	);
}
