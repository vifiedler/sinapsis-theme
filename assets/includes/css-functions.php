<?php
/**
 * Enqueue the theme's styles.
 */
function sinapsis_theme_enqueue_styles() {
	wp_enqueue_style(
		'sinapsis-theme-bootstrap',
		'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
		array(),
		'5.3.8'
	);

	wp_enqueue_style(
		'sinapsis-theme-library',
		get_template_directory_uri() . '/assets/librerias/css/estilo-sinapsis.css',
		array( 'sinapsis_theme-style', 'sinapsis-theme-bootstrap' ),
		_S_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'sinapsis_theme_enqueue_styles' );