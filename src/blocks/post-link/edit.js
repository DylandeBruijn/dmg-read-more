import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SearchControl, Spinner, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useDebouncedInput } from '@wordpress/compose';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { postTitle, postUrl } = attributes;
	const [searchTerm, setSearchTerm, debouncedSearchTerm] = useDebouncedInput("");

	const { posts, isResolving } = useSelect(
		(select) => {
			if (!debouncedSearchTerm) {
				return { posts: [], isResolving: false };
			}

			const { getEntityRecords, isResolving: checkResolving } = select('core');

			const query = {
				status: 'publish',
				per_page: 5,
				_fields: ['id', 'title', 'link'],
				search: debouncedSearchTerm,
			};

			return {
				posts: getEntityRecords('postType', 'post', query) || [],
				isResolving: checkResolving('getEntityRecords', ['postType', 'post', query]),
			};
		},
		[debouncedSearchTerm]
	);

	const handlePostUnlink = () => {
		setAttributes({ postTitle: "", postUrl: "#" });
		setSearchTerm("");
	};

	const handlePostSelect = (selectedPost) => {
		setSearchTerm('');
		setAttributes({
			postId: selectedPost.id,
			postTitle: selectedPost.title.rendered,
			postUrl: selectedPost.link,
		});
	};

	const linkText = postTitle ? `Read More: ${postTitle}` : 'Read More';

	return (
		<>
			<InspectorControls>
				<PanelBody title="Settings" initialOpen={true}>
					{postTitle && (
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
							<span>
								<span style={{ fontWeight: 500 }}>{__('Selected Post:', 'dmg-read-more')}</span> {postTitle}
							</span>
							<Button variant="link" onClick={handlePostUnlink}>Unlink</Button>
						</div>
					)}
					<SearchControl
						label={__('Search Posts', 'dmg-read-more')}
						help={__('Search for a post to link to.', 'dmg-read-more')}
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder={__('Search post...', 'dmg-read-more')}

					/>
					{isResolving && <Spinner />}
					{!isResolving && posts.length > 0 && (
						<>
							<span style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
								Search Results:
							</span>
							<ul style={{ margin: 0 }}>
								{posts.map((post) => (
									<li
										key={post.id}
										style={{ margin: 0 }}
									>
										<Button variant="link" onClick={() => handlePostSelect(post)}>
											{post.title.rendered || __('(No title)', 'dmg-read-more')}
										</Button>
									</li>
								))}
							</ul>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<p {...useBlockProps({ className: 'dmg-read-more' })}>
				<a href={postUrl}>{linkText}</a>
			</p>
		</>
	);
}
