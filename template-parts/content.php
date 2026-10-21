	<?php get_template_part( 'assets/modulos/loop-recomendaciones' ); ?>
<header class="catalog-header row align-items-end g-4">
	<div class="col-12 col-lg">
		<h1><?php esc_html_e( 'Catálogo de librerías JavaScript y plugins jQuery', 'sinapsis_theme' ); ?></h1>
		<p><?php esc_html_e( 'Explora recursos técnicos, guarda tus favoritos y consulta una ficha sin abandonar esta página.', 'sinapsis_theme' ); ?></p>
	</div>
	<div class="catalog-header__stats col-12 col-sm-auto">
		<strong id="catalog-count">--</strong>
		<span><?php esc_html_e( 'módulos publicados', 'sinapsis_theme' ); ?></span>
	</div>
</header>

<div class="catalog-toolbar d-flex flex-wrap align-items-center gap-2">
	<span class="eyebrow">ESTANTERÍAS</span>
</div>
<?php get_template_part( 'template-parts/content-library-loop' ); ?>
