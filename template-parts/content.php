<header class="catalog-header row align-items-end g-4">
	<div class="col-12 col-lg">
		<span class="eyebrow">CORE_CATALOG / SPEC_SHEETS_INDEX</span>
		<h1><?php esc_html_e( 'Catálogo de librerías JavaScript', 'sinapsis_theme' ); ?></h1>
		<p><?php esc_html_e( 'Explora recursos técnicos, guarda tus favoritos y consulta una ficha sin abandonar esta página.', 'sinapsis_theme' ); ?></p>
	</div>
	<div class="catalog-header__stats col-12 col-sm-auto">
		<strong id="catalog-count">--</strong>
		<span><?php esc_html_e( 'módulos publicados', 'sinapsis_theme' ); ?></span>
	</div>
</header>

<div class="catalog-toolbar d-flex flex-wrap align-items-center gap-2">
	<span class="eyebrow">ESTANTERÍA_01</span>
	<strong><?php esc_html_e( 'Recursos técnicos', 'sinapsis_theme' ); ?></strong>
	<span class="toolbar-note">REST API / GRID READY</span>
</div>

<?php get_template_part( 'assets/modulos/loop-tarjetas' ); ?>
