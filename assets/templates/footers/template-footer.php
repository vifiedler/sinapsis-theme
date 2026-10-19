<?php
/**
 * Widget-based footer template.
 *
 * @package sinapsis_theme
 */
?>

<footer id="colophon" class="sinapsis-footer mt-3">
	<div class="container-fluid">
		<div class="row align-items-center">
			<?php if ( is_active_sidebar( 'footer_1' ) ) : ?>
				<div class="col-12 col-lg-4">
					<?php dynamic_sidebar( 'footer_1' ); ?>
				</div>
			<?php endif; ?>

			<div class="col-12 col-lg-5">
				<nav class="sinapsis-footer__navigation"
					aria-label="<?php esc_attr_e( 'Enlaces del footer', 'sinapsis_theme' ); ?>">
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'widgets-footer',
							'menu_class'     => 'sinapsis-footer__menu',
							'container'      => false,
							'fallback_cb'    => false,
							'depth'          => 1,
						)
					);
					?>
				</nav>
			</div>

			<?php if ( is_active_sidebar( 'footer_3' ) ) : ?>
				<div class="col-12 col-lg-3">
					<?php dynamic_sidebar( 'footer_3' ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</footer>
