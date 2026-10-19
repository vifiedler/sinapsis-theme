<article id="post-<?php the_ID(); ?>" <?php post_class( 'library-entry container-fluid py-4' ); ?> data-rest-post-id="<?php echo esc_attr( get_the_ID() ); ?>">
	<header class="entry-header library-entry__header mb-4">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header>

	<div class="entry-content library-entry__content py-3">
		<p><?php esc_html_e( 'Cargando contenido desde la API REST...', 'sinapsis_theme' ); ?></p>
	</div>

	<div class="library-entry__navigation py-3 mb-4">
		<?php
		the_post_navigation(
			array(
				'aria_label' => esc_attr__( 'Navegación de entradas', 'sinapsis_theme' ),
				'prev_text'  => '<span class="nav-subtitle">' . esc_html__( 'Anterior:', 'sinapsis_theme' ) . '</span> <span class="nav-title">%title</span>',
				'next_text'  => '<span class="nav-subtitle">' . esc_html__( 'Siguiente:', 'sinapsis_theme' ) . '</span> <span class="nav-title">%title</span>',
			)
		);
		?>
	</div>

	<?php if ( comments_open() || get_comments_number() ) : ?>
		<?php comments_template(); ?>
	<?php endif; ?>
</article>
