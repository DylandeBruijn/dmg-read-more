import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const Pagination = ( { currentPage, totalPages, onPageChange } ) => {
	return (
		<div
			style={ {
				display: 'flex',
				alignItems: 'center',
				gap: '4px',
				marginTop: '12px',
			} }
		>
			<Button
				variant="secondary"
				size="small"
				style={ { alignItems: 'baseline' } }
				disabled={ currentPage === 1 }
				onClick={ () => onPageChange( 1 ) }
				aria-label={ __( 'First page', 'dmg-read-more' ) }
			>
				«
			</Button>

			<Button
				variant="secondary"
				size="small"
				style={ { alignItems: 'baseline' } }
				disabled={ currentPage === 1 }
				onClick={ () => onPageChange( currentPage - 1 ) }
				aria-label={ __( 'Previous page', 'dmg-read-more' ) }
			>
				‹
			</Button>

			<span
				style={ {
					padding: '0 4px',
					fontSize: '13px',
					whiteSpace: 'nowrap',
				} }
			>
				{ currentPage } { __( 'of', 'dmg-read-more' ) } { totalPages }
			</span>

			<Button
				variant="secondary"
				size="small"
				style={ { alignItems: 'baseline' } }
				disabled={ currentPage === totalPages }
				onClick={ () => onPageChange( currentPage + 1 ) }
				aria-label={ __( 'Next page', 'dmg-read-more' ) }
			>
				›
			</Button>

			<Button
				variant="secondary"
				size="small"
				style={ { alignItems: 'baseline' } }
				disabled={ currentPage === totalPages }
				onClick={ () => onPageChange( totalPages ) }
				aria-label={ __( 'Last page', 'dmg-read-more' ) }
			>
				»
			</Button>
		</div>
	);
};

export default Pagination;
