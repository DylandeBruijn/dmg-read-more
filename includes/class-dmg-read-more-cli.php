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
	 *     # Find all posts containing the post-link block
	 *     $ wp dmg-read-more search dmg-read-more/post-link
	 *
	 *     # Find pages containing a core paragraph block
	 *     $ wp dmg-read-more search core/paragraph --post_type=page
	 *
	 *     # Output results as JSON
	 *     $ wp dmg-read-more search dmg-read-more/post-link --format=json
	 *
	 * @when after_wp_load
	 */
	public function __invoke( $args, $assoc_args ) {
		$block_name = isset( $args[0] ) ? $args[0] : '';

		WP_CLI::success( "Searching for posts containing block: {$block_name}" );
	}
}
