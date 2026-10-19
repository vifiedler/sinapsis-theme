<?php
/**
 * Top navigation template.
 *
 * @package sinapsis_theme
 */
?>

<nav class="library-topbar__navigation" aria-label="<?php esc_attr_e( 'Navegación principal', 'sinapsis_theme' ); ?>">
	<?php
	wp_nav_menu(
		array(
			'theme_location' => 'menu-superior',
			'menu_class'     => 'library-topbar__menu',
			'container'      => false,
			'depth'          => 2,
			'walker'         => new Sinapsis_Theme_Nav_Menu_Walker(),
			'fallback_cb'    => false,
		)
	);
	?>

	<div class="library-topbar__account">
		<?php if ( is_user_logged_in() ) : ?>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/usuario/' ) ); ?>">
				<?php esc_html_e( 'Mi perfil', 'sinapsis_theme' ); ?>
			</a>
			<a class="nav-link" href="<?php echo esc_url( wp_logout_url( home_url( '/' ) ) ); ?>">
				<?php esc_html_e( 'Cerrar sesión', 'sinapsis_theme' ); ?>
			</a>
		<?php else : ?>
			<a class="nav-link" href="<?php echo esc_url( wp_login_url( home_url( '/' ) ) ); ?>">
				<?php esc_html_e( 'Iniciar sesión', 'sinapsis_theme' ); ?>
			</a>
			<a class="nav-link" href="<?php echo esc_url( wp_registration_url() ); ?>">
				<?php esc_html_e( 'Registrarse', 'sinapsis_theme' ); ?>
			</a>
		<?php endif; ?>
	</div>
</nav>
