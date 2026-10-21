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
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>
	<div class="library-shell">
		<header id="masthead" class="library-topbar d-flex align-items-center justify-content-between">
			<?php include get_template_directory() . '/assets/templates/navs/nav.php'; ?>
		</header>
		<div id="page" class="site">
			<a class="skip-link screen-reader-text"
				href="#primary"><?php esc_html_e('Skip to content', 'sinapsis_theme'); ?></a>

			<aside class="library-sidebar d-flex flex-column"
				aria-label="<?php esc_attr_e('Filtros y favoritos', 'sinapsis_theme'); ?>"
				data-user-logged-in="<?php echo is_user_logged_in() ? 'true' : 'false'; ?>">
				<div class="library-sidebar__brand d-flex align-items-center">
					<span class="library-sidebar__mark d-none">∎</span>
					<span class="d-none"><?php esc_html_e('REGISTRY // FILTERS', 'sinapsis_theme'); ?></span>
				</div>

				<form class="library-search w-100" role="search" method="get" data-library-search-form
					action="<?php echo esc_url(home_url('/')); ?>">
					<label class="screen-reader-text"
						for="library-search"><?php esc_html_e('Buscar en la biblioteca', 'sinapsis_theme'); ?></label>
					<input id="library-search" type="search" name="s" data-library-search-input
						placeholder="<?php esc_attr_e('Buscar librería o función...', 'sinapsis_theme'); ?>">
				</form>

				<nav class="library-sidebar__nav d-flex flex-column gap-1"
					aria-label="<?php esc_attr_e('Navegación de biblioteca', 'sinapsis_theme'); ?>">
					<span
						class="library-sidebar__label"><?php esc_html_e('Formato de código', 'sinapsis_theme'); ?></span>
					<a class="is-active" href="<?php echo esc_url(home_url('/')); ?>" data-library-filter-group="type"
						data-library-filter="all"><?php esc_html_e('Todos los módulos', 'sinapsis_theme'); ?><span
							data-catalog-count="type-all">--</span></a>
					<a href="#library-catalog" data-library-filter-group="type"
						data-library-filter="plugin"><?php esc_html_e('Plugins', 'sinapsis_theme'); ?><span
							data-catalog-count="type-plugin">--</span></a>
					<a href="#library-catalog" data-library-filter-group="type"
						data-library-filter="library"><?php esc_html_e('Librerías', 'sinapsis_theme'); ?><span
							data-catalog-count="type-library">--</span></a>
				</nav>
				<nav class="library-sidebar__nav d-flex flex-column gap-1"
					aria-label="<?php esc_attr_e('Navegación de biblioteca', 'sinapsis_theme'); ?>">
					<span
						class="library-sidebar__label"><?php esc_html_e('Niveles de Dificultad', 'sinapsis_theme'); ?></span>
					<a class="is-active" href="<?php echo esc_url(home_url('/')); ?>"
						data-library-filter-group="difficulty"
						data-library-filter="all"><?php esc_html_e('Todas las dificultades', 'sinapsis_theme'); ?><span
							data-catalog-count="difficulty-all">--</span></a>
					<a href="#library-catalog" data-library-filter-group="difficulty"
						data-library-filter="facil"><?php esc_html_e('Fácil', 'sinapsis_theme'); ?><span
							data-catalog-count="difficulty-facil">--</span></a>
					<a href="#library-catalog" data-library-filter-group="difficulty"
						data-library-filter="intermedio"><?php esc_html_e('Intermedio', 'sinapsis_theme'); ?><span
							data-catalog-count="difficulty-intermedio">--</span></a>
					<a href="#library-catalog" data-library-filter-group="difficulty"
						data-library-filter="dificil"><?php esc_html_e('Difícil', 'sinapsis_theme'); ?><span
							data-catalog-count="difficulty-dificil">--</span></a>
				</nav>
				<nav class="library-sidebar__nav d-flex flex-column gap-1"
					aria-label="<?php esc_attr_e('Categorías de librería', 'sinapsis_theme'); ?>"
					data-library-taxonomy-filters>
					<span class="library-sidebar__label"><?php esc_html_e('Categorías', 'sinapsis_theme'); ?></span>
					<a class="is-active" href="#library-catalog" data-library-filter-group="shelf"
						data-library-filter="all"><?php esc_html_e('Todas las categorías', 'sinapsis_theme'); ?><span
							data-catalog-count="shelf-all">--</span></a>
				</nav>

				<div class="library-sidebar__account-panel">
					<div class="favorite-dropzone">
						<span
							class="library-sidebar__label"><?php esc_html_e('Favoritos del usuario', 'sinapsis_theme'); ?></span>
						<div id="zona-favoritos" class="favorite-dropzone__box">
							<strong class="texto-vacio"><?php esc_html_e('Arrastra aquí', 'sinapsis_theme'); ?></strong>
							<span
								class="texto-vacio"><?php esc_html_e('Tus scripts y librerías favoritas', 'sinapsis_theme'); ?></span>
						</div>
					</div>

					<a class="library-user-link d-flex align-items-center"
						href="<?php echo esc_url(home_url('/usuario/')); ?>">
						<span class="user-avatar">VF</span>
						<span><strong><?php esc_html_e('Mi espacio', 'sinapsis_theme'); ?></strong><small><?php esc_html_e('Ver perfil y guardados', 'sinapsis_theme'); ?></small></span>
					</a>
				</div>
			</aside>