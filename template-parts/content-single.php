<?php
$description = sinapsis_theme_get_field( 'descripcion' );
$link        = sinapsis_theme_get_field( 'link' );
$image       = sinapsis_theme_get_image_url( sinapsis_theme_get_field( 'imagen' ) );
$installation = sinapsis_theme_get_field( 'instalacion' );
$code         = sinapsis_theme_get_field( 'codigo-ejemplo' );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'library-entry container-fluid' ); ?>>
	<header class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header>

	<?php if ( $image ) : ?>
		<div class="post-thumbnail">
			<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>">
		</div>
	<?php endif; ?>

	<div class="entry-content py-3">
		<?php if ( $description ) : ?>
			<div class="library-entry__description"><?php echo wp_kses_post( wpautop( (string) $description ) ); ?></div>
		<?php endif; ?>

		<?php the_content(); ?>

		<?php if ( $installation ) : ?>
			<section class="library-entry__section">
				<h2><?php esc_html_e( 'Instalación', 'sinapsis_theme' ); ?></h2>
				<?php echo wp_kses_post( wpautop( (string) $installation ) ); ?>
			</section>
		<?php endif; ?>

		<?php if ( $code ) : ?>
			<section class="library-entry__section">
				<h2><?php esc_html_e( 'Código de ejemplo', 'sinapsis_theme' ); ?></h2>
				<pre><code><?php echo esc_html( (string) $code ); ?></code></pre>
			</section>
		<?php endif; ?>

		<?php if ( is_string( $link ) && wp_http_validate_url( $link ) ) : ?>
			<p><a href="<?php echo esc_url( $link ); ?>" rel="external noopener"><?php esc_html_e( 'Visitar recurso', 'sinapsis_theme' ); ?></a></p>
		<?php endif; ?>
	</div>

	<?php
	the_post_navigation(
		array(
			'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'sinapsis_theme' ) . '</span> <span class="nav-title">%title</span>',
			'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'sinapsis_theme' ) . '</span> <span class="nav-title">%title</span>',
		)
	);
	?>

	<?php if ( comments_open() || get_comments_number() ) : ?>
		<?php comments_template(); ?>
	<?php endif; ?>
</article>
