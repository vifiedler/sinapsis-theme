<?php
add_filter( 'use_widgets_block_editor', '__return_false' );

/**
 * Register the footer widget areas.
 */
function sinapsis_theme_register_footer_widgets() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Footer columna 1', 'sinapsis_theme' ),
			'id'            => 'footer_1',
			'before_widget' => '<div id="%1$s" class="sinapsis-footer__widget d-flex justify-content-center mb-4">',
			'after_widget'  => '</div>',
			'before_title'  => '<h2 class="mb-3 d-none">',
			'after_title'   => '</h2>',
		)
	);

	register_sidebar(
		array(
			'name'          => esc_html__( 'Footer columna 2', 'sinapsis_theme' ),
			'id'            => 'footer_2',
			'before_widget' => '<div id="%1$s" class="sinapsis-footer__links d-flex flex-wrap justify-content-center gap-3 mb-3">',
			'after_widget'  => '</div>',
			'before_title'  => '<h2 class="mb-3 d-none">',
			'after_title'   => '</h2>',
		)
	);

	register_sidebar(
		array(
			'name'          => esc_html__( 'Footer: Copyright', 'sinapsis_theme' ),
			'id'            => 'footer_3',
			'before_widget' => '<div id="%1$s" class="sinapsis-footer__copyright d-flex justify-content-center">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="d-none">',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'sinapsis_theme_register_footer_widgets' );