<?php
$description = sinapsis_theme_get_field( 'descripcion' );
$image       = sinapsis_theme_get_image_url( sinapsis_theme_get_field( 'imagen' ) );
$difficulty  = sinapsis_theme_get_field( 'dificultad' );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'library-card' ); ?>>
	<?php if ( $image ) : ?>
		<a class="library-card__image" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
			<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>">
		</a>
	<?php endif; ?>

	<div class="library-card__content">
		<header class="entry-header">
			<?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '">', '</a></h2>' ); ?>
			<?php if ( $difficulty ) : ?>
				<span class="library-card__difficulty"><?php echo esc_html( is_scalar( $difficulty ) ? (string) $difficulty : '' ); ?></span>
			<?php endif; ?>
		</header>

		<?php if ( $description ) : ?>
			<div class="entry-summary"><?php echo wp_kses_post( wpautop( (string) $description ) ); ?></div>
		<?php else : ?>
			<div class="entry-summary"><?php the_excerpt(); ?></div>
		<?php endif; ?>

		<a class="library-card__link" href="<?php the_permalink(); ?>">
			<?php esc_html_e( 'Ver recurso', 'sinapsis_theme' ); ?>
		</a>
	</div>
</article>
