<?php
/**
 * Enqueue the JavaScript dependencies used by the visual prototype.
 */
function sinapsis_theme_enqueue_dependencies() {
	if ( is_admin() ) {
		return;
	}

	wp_deregister_script( 'jquery' );
	wp_register_script(
		'jquery',
		'https://cdn.jsdelivr.net/npm/jquery@4.0.0/dist/jquery.min.js',
		array(),
		'4.0.0',
		true
	);
	wp_enqueue_script( 'jquery' );

	wp_enqueue_script(
		'sinapsis-theme-bootstrap',
		'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
		array( 'jquery' ),
		'5.3.8',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'sinapsis_theme_enqueue_dependencies', 20 );
