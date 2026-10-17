<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package sinapsis_theme
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'sinapsis_theme' ); ?></a>

	<aside class="library-sidebar d-flex flex-column" aria-label="<?php esc_attr_e( 'Filtros y favoritos', 'sinapsis_theme' ); ?>">
		<div class="library-sidebar__brand d-flex align-items-center">
			<span class="library-sidebar__mark">∎</span>
			<span><?php esc_html_e( 'REGISTRY // FILTERS', 'sinapsis_theme' ); ?></span>
		</div>

		<form class="library-search w-100" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
			<label class="screen-reader-text" for="library-search"><?php esc_html_e( 'Buscar en la biblioteca', 'sinapsis_theme' ); ?></label>
			<input id="library-search" type="search" name="s" placeholder="<?php esc_attr_e( 'Buscar librería o función...', 'sinapsis_theme' ); ?>">
		</form>

		<nav class="library-sidebar__nav d-flex flex-column gap-1" aria-label="<?php esc_attr_e( 'Navegación de biblioteca', 'sinapsis_theme' ); ?>">
			<span class="library-sidebar__label"><?php esc_html_e( '01. Arquitectura & Stack', 'sinapsis_theme' ); ?></span>
			<a class="is-active" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Todos los módulos', 'sinapsis_theme' ); ?><b>06</b></a>
			<a href="#masonry"><?php esc_html_e( 'JS nativo moderno', 'sinapsis_theme' ); ?><b>03</b></a>
			<a href="#datatables"><?php esc_html_e( 'jQuery plugins', 'sinapsis_theme' ); ?><b>03</b></a>

			<span class="library-sidebar__label"><?php esc_html_e( '02. Clasificación técnica', 'sinapsis_theme' ); ?></span>
			<a href="#masonry"><span><?php esc_html_e( 'Layout & Estructura', 'sinapsis_theme' ); ?><small>Masonry, Swiper, Slick</small></span></a>
			<a href="#datatables"><span><?php esc_html_e( 'Display & Efectos', 'sinapsis_theme' ); ?><small>DataTables, Chart.js</small></span></a>
		</nav>

		<div class="favorite-dropzone mt-auto">
			<span class="library-sidebar__label"><?php esc_html_e( 'Favoritos del usuario', 'sinapsis_theme' ); ?></span>
			<div class="favorite-dropzone__box">
				<strong><?php esc_html_e( 'Arrastra aquí', 'sinapsis_theme' ); ?></strong>
				<span><?php esc_html_e( 'Tus scripts y librerías favoritas', 'sinapsis_theme' ); ?></span>
			</div>
		</div>

		<a class="library-user-link d-flex align-items-center" href="<?php echo esc_url( home_url( '/usuario/' ) ); ?>">
			<span class="user-avatar">VF</span>
			<span><strong><?php esc_html_e( 'Mi espacio', 'sinapsis_theme' ); ?></strong><small><?php esc_html_e( 'Ver perfil y guardados', 'sinapsis_theme' ); ?></small></span>
		</a>
	</aside>

	<div class="library-shell">
		<header id="masthead" class="library-topbar d-flex align-items-center justify-content-between">
			<div>
				<span class="library-topbar__path">WP // CODEX UI <em>v1.0</em></span>
				<span class="library-topbar__connection">● REST READY</span>
			</div>
			<nav id="site-navigation" class="d-flex align-items-center gap-3" aria-label="<?php esc_attr_e( 'Primary menu', 'sinapsis_theme' ); ?>">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Catálogo', 'sinapsis_theme' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/usuario/' ) ); ?>"><?php esc_html_e( 'Usuario', 'sinapsis_theme' ); ?></a>
			</nav>
		</header>
