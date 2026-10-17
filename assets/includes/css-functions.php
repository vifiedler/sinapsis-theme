<?php
/**
 * Enqueue the theme's styles.
 */
function sinapsis_theme_enqueue_styles() {
	wp_enqueue_style(
		'sinapsis-theme-library',
		get_template_directory_uri() . '/assets/librerias/css/estilo-sinapsis.css',
		array( 'sinapsis_theme-style' ),
		_S_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'sinapsis_theme_enqueue_styles' );