<?php
/**
 * Enqueue scripts required by the theme.
 */
function sinapsis_theme_enqueue_scripts() {
	if ( ! is_admin() ) {
		wp_enqueue_script(
			'sinapsis-theme-library',
			get_template_directory_uri() . '/assets/librerias/js/js-sinapsis.js',
			array(),
			_S_VERSION,
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'sinapsis_theme_enqueue_scripts' );