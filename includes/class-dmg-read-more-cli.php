<?php
/**
 * WP-CLI commands for DMG Read More plugin
 *
 * @package Dmg_Read_More
 */

namespace DMG\ReadMore\CLI;

use WP_CLI;

/**
 * Search for posts containing a specific Gutenberg block.
 */
class Search_Command {

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
	 * [--format=<format>]
	 * : Render output in a particular format.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 *   - csv
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
	 *     # Output results as JSON
	 *     $ wp dmg-read-more search dmg-read-more/post-link --format=json
	 *
	 * @when after_wp_load
	 */
	public function __invoke( $args, $assoc_args ) {
		$block_name = isset( $args[0] ) ? $args[0] : '';

		$assoc_args = wp_parse_args(
			$assoc_args,
			array(
				'post_type'   => 'post',
				'date-after'  => date( 'Y-m-d', strtotime( '-30 days' ) ),
				'date-before' => date( 'Y-m-d' ),
				'format'      => 'table',
			)
		);

		WP_CLI::success(
			sprintf(
				'Searching for posts containing block: %s (from %s to %s)',
				$block_name,
				$assoc_args['date-after'],
				$assoc_args['date-before']
			)
		);
	}
}
