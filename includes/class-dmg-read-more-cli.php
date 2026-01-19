<?php
/**
 * WP-CLI commands for DMG Read More plugin
 *
 * @package Dmg_Read_More
 */

namespace DMG\ReadMore\CLI;

use WP_CLI;
use WP_Query;

/**
 * Search for posts containing a specific Gutenberg block.
 */
class Search_Command {

	/**
	 * Block comment pattern to search for.
	 *
	 * @var string
	 */
	private $block_comment_start;

	/**
	 * Find posts that contain a specific block type.
	 *
	 * ## OPTIONS
	 *
	 * <block-name>
	 * : The block name to search for (e.g., 'core/paragraph' or 'dmg-read-more/post-link').
	 *
	 * [--post_type=<post_type>]
	 * : Limit search to a specific post type.
	 * ---
	 * default: post
	 * ---
	 *
	 * [--date-after=<date>]
	 * : Search for posts published after this date (YYYY-MM-DD format).
	 * ---
	 * default: 30 days ago
	 * ---
	 *
	 * [--date-before=<date>]
	 * : Search for posts published before this date (YYYY-MM-DD format).
	 * ---
	 * default: today
	 * ---
	 *
	 * [--limit=<number>]
	 * : Maximum number of results to return. Use 0 for unlimited.
	 * ---
	 * default: 100
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     # Find all posts containing the post-link block (last 30 days)
	 *     $ wp dmg-read-more search dmg-read-more/post-link
	 *
	 *     # Find posts from a specific date range
	 *     $ wp dmg-read-more search dmg-read-more/post-link --date-after=2024-01-01 --date-before=2024-12-31
	 *
	 *     # Find pages containing a core paragraph block
	 *     $ wp dmg-read-more search core/paragraph --post_type=page
	 *
	 *     # Find posts from the last 7 days
	 *     $ wp dmg-read-more search dmg-read-more/post-link --date-after=2026-01-11
	 *
	 *     # Limit results to 500 posts
	 *     $ wp dmg-read-more search dmg-read-more/post-link --limit=500
	 *
	 *     # Get unlimited results
	 *     $ wp dmg-read-more search dmg-read-more/post-link --limit=0
	 *
	 * @when after_wp_load
	 */
	public function __invoke( $args, $assoc_args ) {
		if ( empty( $args[0] ) ) {
			WP_CLI::error( 'Please provide a block name to search for.' );
		}

		$block_name = $args[0];

		$assoc_args = wp_parse_args(
			$assoc_args,
			array(
				'post_type'   => 'post',
				'date-after'  => date( 'Y-m-d', strtotime( '-30 days' ) ),
				'date-before' => date( 'Y-m-d' ),
				'limit'       => 100,
			)
		);

		$this->block_comment_start = '<!-- wp:' . $block_name . ' ';

		add_filter( 'posts_where', array( $this, 'filter_posts_where' ) );

		$query_args = array(
			'post_type'              => $assoc_args['post_type'],
			'post_status'            => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page'         => ( $assoc_args['limit'] > 0 ) ? (int) $assoc_args['limit'] : -1,
			'orderby'                => 'date',
			'order'                  => 'DESC',
			'date_query'             => array(
				array(
					'after'     => $assoc_args['date-after'] . ' 00:00:00',
					'before'    => $assoc_args['date-before'] . ' 23:59:59',
					'inclusive' => true,
				),
			),
			'no_found_rows'          => true,
			'fields'                 => 'ids',
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
			'cache_results'          => false,
		);

		$query = new WP_Query( $query_args );

		remove_filter( 'posts_where', array( $this, 'filter_posts_where' ) );

		if ( empty( $query->posts ) ) {
			return;
		}

		WP_CLI::line( implode( ' ', $query->posts ) );
	}

	/**
	 * Filter the WHERE clause to search for block pattern in post content.
	 *
	 * This method is hooked into 'posts_where' filter to modify the SQL query.
	 *
	 * @param string $where The existing WHERE clause.
	 * @return string Modified WHERE clause with block search condition.
	 */
	public function filter_posts_where( $where ) {
		global $wpdb;

		$escaped_pattern = $wpdb->esc_like( $this->block_comment_start );

		$search_pattern = '%' . $escaped_pattern . '%';

		$where .= $wpdb->prepare(
			' AND ' . $wpdb->posts . '.post_content LIKE %s',
			$search_pattern
		);

		return $where;
	}
}
