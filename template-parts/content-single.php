<?php
$description = sinapsis_theme_get_field( 'descripcion' );
$link        = sinapsis_theme_get_field( 'link' );
$image       = sinapsis_theme_get_image_url( sinapsis_theme_get_field( 'imagen' ) );
$installation = sinapsis_theme_get_field( 'instalacion' );
$code         = sinapsis_theme_get_field( 'codigo-ejemplo' );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'library-entry container-fluid py-4' ); ?>>
	<header class="entry-header library-entry__header mb-4">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header>

	<?php if ( $image ) : ?>
		<div class="post-thumbnail library-entry__image mb-4">
			<img class="img-fluid rounded border" src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>">
		</div>
	<?php endif; ?>

	<div class="entry-content library-entry__content py-3">
		<?php if ( $description ) : ?>
			<div class="library-entry__description mb-4"><?php echo wp_kses_post( wpautop( (string) $description ) ); ?></div>
		<?php endif; ?>

		<?php the_content(); ?>

		<?php if ( $installation ) : ?>
			<section class="library-entry__section my-4">
				<h2><?php esc_html_e( 'Instalación', 'sinapsis_theme' ); ?></h2>
				<div class="library-entry__formatted-content"><?php echo wp_kses_post( wpautop( (string) $installation ) ); ?></div>
			</section>
		<?php endif; ?>

		<?php if ( $code ) : ?>
			<section class="library-entry__section my-4">
				<h2><?php esc_html_e( 'Código de ejemplo', 'sinapsis_theme' ); ?></h2>
				<div class="library-entry__code"><pre class="mb-0"><code><?php echo esc_html( (string) $code ); ?></code></pre></div>
			</section>
		<?php endif; ?>

		<?php if ( is_string( $link ) && wp_http_validate_url( $link ) ) : ?>
			<p class="mb-4"><a class="btn btn-outline-light btn-sm" href="<?php echo esc_url( $link ); ?>" rel="external noopener"><?php esc_html_e( 'Visitar recurso', 'sinapsis_theme' ); ?></a></p>
		<?php endif; ?>
	</div>

	<div class="library-entry__navigation py-3 mb-4">
		<?php
		the_post_navigation(
			array(
				'aria_label' => esc_attr__( 'Navegación de entradas', 'sinapsis_theme' ),
				'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Anterior:', 'sinapsis_theme' ) . '</span> <span class="nav-title">%title</span>',
				'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Siguiente:', 'sinapsis_theme' ) . '</span> <span class="nav-title">%title</span>',
			)
		);
		?>
	</div>

	<?php if ( comments_open() || get_comments_number() ) : ?>
		<?php comments_template(); ?>
	<?php endif; ?>
</article>
