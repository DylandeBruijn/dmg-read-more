<?php

/**
 * Plugin Name:     DMG Read More
 * Plugin URI:      https://github.com/DylandeBruijn/dmg-read-more
 * Description:     WordPress plugin that contains a Gutenberg block for inserting stylized post links and a WP-CLI search command
 * Author:          Dylan de Bruijn
 * Author URI:      https://github.com/DylandeBruijn
 * Text Domain:     dmg-read-more
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Dmg_Read_More
 */

namespace DMG\ReadMore;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers blocks
 */
function register_blocks() {
	$build_dir = __DIR__ . '/build/blocks';
	$manifest  = __DIR__ . '/build/blocks-manifest.php';

	// WP 6.8+: one-call convenience.
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( $build_dir, $manifest );
		return;
	}

	// WP 6.7: index the collection, then loop and register each block from metadata.
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( $build_dir, $manifest );
		$manifest_data = require $manifest;
		foreach ( array_keys( $manifest_data ) as $block_type ) {
			register_block_type_from_metadata( $build_dir . '/' . $block_type );
		}
		return;
	}

	// WP 5.5-6.6: no collection APIs; just loop the manifest directly.
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
		$manifest_data = require $manifest;
		foreach ( array_keys( $manifest_data ) as $block_type ) {
			register_block_type_from_metadata( $build_dir . '/' . $block_type );
		}
		return;
	}
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
