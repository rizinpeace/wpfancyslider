<?php

/**
 * Plugin Name: Fancy Slider Block
 * Description: A custom block that displays a simple slider with images.
 * Version: 1.0.4
 * Author: Riz
 * Author URI: https://www.pixeld.com.au
 * Text Domain: fancy-slider-block
 * Domain Path: /languages
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Requires at least: 5.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Load plugin text domain
function fancy_slider_load_textdomain() {
    load_plugin_textdomain('fancy-slider-block', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'fancy_slider_load_textdomain');

// Register blocks
function register_fancy_slider_blocks() {
    // Check if the child theme's fancy slider block is already registered
    //if (wp_block_type_registry()->is_registered('spectra-one-child/fancy-slider')) {
        // If child theme block exists, don't register plugin version to avoid conflicts
      //  return;
    //}

    // Include fancy slider block render function
    require_once plugin_dir_path(__FILE__) . '/blocks/render.php';
    
    // Register Fancy Slider Block with proper editor and frontend scripts
    register_block_type(plugin_dir_path(__FILE__) . '/blocks', array(
        'editor_script' => 'fancy-slider-block-editor',
        'editor_style'  => 'fancy-slider-block-style',
        'style'         => 'fancy-slider-block-style',
        'render_callback' => 'render_fancy_slider_block'
    ));

    // Register fancy slider block assets
    wp_register_script(
        'fancy-slider-block-editor',
        plugin_dir_url(__FILE__) . 'blocks/index.js',
        array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor', 'wp-components'),
        filemtime(plugin_dir_path(__FILE__) . 'blocks/index.js')
    );

    wp_register_style(
        'fancy-slider-block-style',
        plugin_dir_url(__FILE__) . 'blocks/style.css',
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'blocks/style.css')
    );

    // Enqueue frontend script for fancy slider block
    if (has_block('fancy-slider') || is_admin()) {
        wp_enqueue_script(
            'fancy-slider-frontend-script',
            plugin_dir_url(__FILE__) . 'blocks/script.js',
            array('jquery'),
            filemtime(plugin_dir_path(__FILE__) . 'blocks/script.js'),
            true
        );
    }
}
add_action('init', 'register_fancy_slider_blocks');

// Add admin notice if child theme block is detected
function fancy_slider_admin_notice() {
    if (wp_block_type_registry()->is_registered('spectra-one-child/fancy-slider')) {
        echo '<div class="notice notice-info is-dismissible">';
        echo '<p><strong>Fancy Slider Block:</strong> The child theme already has a Fancy Slider block registered. The plugin version has been disabled to prevent conflicts.</p>';
        echo '</div>';
    }
}
//add_action('admin_notices', 'fancy_slider_admin_notice');

?>