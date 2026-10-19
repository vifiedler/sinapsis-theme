<?php
/**
 * Template part for static pages.
 *
 * @package sinapsis_theme
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'library-entry static-page container-fluid py-4' ); ?>>
	<header class="entry-header library-entry__header mb-4">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header>

	<div class="entry-content library-entry__content py-3">
		<?php the_content(); ?>

		<?php
		wp_link_pages(
			array(
				'before' => '<nav class="page-links" aria-label="' . esc_attr__( 'Paginación de la página', 'sinapsis_theme' ) . '">' . esc_html__( 'Páginas:', 'sinapsis_theme' ),
				'after'  => '</nav>',
			)
		);
		?>
	</div>
</article>
