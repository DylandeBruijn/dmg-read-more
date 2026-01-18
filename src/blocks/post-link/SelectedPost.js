import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const SelectedPost = ( { postTitle, onUnlink } ) => {
	return (
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
				</span>
				<span>{ postTitle }</span>
			</div>
			<Button
				variant="link"
				onClick={ onUnlink }
				style={ { height: 'fit-content' } }
			>
				{ __( 'Unlink', 'dmg-read-more' ) }
			</Button>
		</div>
	);
};

export default SelectedPost;
