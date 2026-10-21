<?php
/**
 * Enqueue the site's UI behavior separately from its REST client.
 */
function sinapsis_theme_enqueue_scripts() {
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

	wp_enqueue_script(
		'sinapsis-theme-anime',
		'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js',
		array(),
		'3.2.2',
		true
	);

	wp_enqueue_script(
		'sinapsis-theme-site',
		get_template_directory_uri() . '/assets/librerias/js/sinapsis-site.js',
		array( 'jquery' ),
		_S_VERSION,
		true
	);

	wp_enqueue_script(
		'sinapsis-theme-rest',
		get_template_directory_uri() . '/assets/librerias/js/sinapsis-rest.js',
		array( 'jquery', 'sinapsis-theme-bootstrap', 'sinapsis-theme-site' ),
		_S_VERSION,
		true
	);

	wp_enqueue_script(
	'sinapsis-theme-recommendations',
	get_template_directory_uri() . '/assets/librerias/js/sinapsis-recommendations.js',
	array( 'jquery' ),
	_S_VERSION,
	true
	);

	if ( is_page_template( 'page-home.php' ) ) {
	wp_enqueue_script(
		'sinapsis-theme-slick',
		'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
		array( 'jquery' ),
		'1.8.1',
		true
	);

	wp_enqueue_script(
		'sinapsis-theme-home-recommendations',
		get_template_directory_uri() . '/assets/librerias/js/sinapsis-home-recommendations.js',
		array( 'jquery', 'sinapsis-theme-slick' ),
		_S_VERSION,
		true
	);
	}

	wp_enqueue_script(
		'sinapsis-theme-animations',
		get_template_directory_uri() . '/assets/librerias/js/sinapsis-animations.js',
		array( 'sinapsis-theme-anime', 'sinapsis-theme-site', 'sinapsis-theme-rest' ),
		_S_VERSION,
		true
	);

	wp_localize_script(
		'sinapsis-theme-rest',
		'sinapsisRestConfig',
		array(
			'postsUrl' => esc_url_raw( rest_url( 'wp/v2/posts' ) ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'sinapsis_theme_enqueue_scripts', 999 );