<?php
/**
 * Template part for the user page.
 *
 * @package sinapsis_theme
 */
?>

<header class="user-page__header mb-4 pb-2">
	<span class="eyebrow">USER_SPACE / PROFILE</span>
	<h1><?php esc_html_e( 'Mi espacio de trabajo', 'sinapsis_theme' ); ?></h1>
	<p class="user-page__intro"><?php esc_html_e( 'Aquí podrás consultar tus scripts favoritos y las recomendaciones generadas a partir de tu colección.', 'sinapsis_theme' ); ?></p>
</header>

<section class="user-page__panel mb-4" aria-labelledby="user-summary-title">
	<div class="row align-items-start justify-content-between g-3">
		<div class="col-12 col-lg">
			<span class="eyebrow">ACCOUNT / DEMO_USER</span>
			<h2 id="user-summary-title">Vicente Fiedler</h2>
			<p class="user-page__intro"><?php esc_html_e( 'Perfil de prueba para validar la estructura visual antes de conectar autenticación y persistencia.', 'sinapsis_theme' ); ?></p>
		</div>
		<span class="library-type col-auto align-self-start">REST READY</span>
	</div>
</section>

<section class="user-page__panel mb-4" aria-labelledby="favorites-title">
	<span class="eyebrow">COLLECTION / SAVED_ITEMS</span>
	<h2 id="favorites-title"><?php esc_html_e( 'Favoritos guardados', 'sinapsis_theme' ); ?></h2>
	<div class="user-page__items row g-3">
		<div class="user-page__item col-12 col-md-6">
			<strong>DataTables</strong>
			<span>jQuery Plugin · Display & Efectos · v1.13.8</span>
		</div>
		<div class="user-page__item col-12 col-md-6">
			<strong>Swiper.js</strong>
			<span>JS Nativo · Layout & Estructura · v11.1.0</span>
		</div>
	</div>
</section>

<section class="user-page__panel mb-4" aria-labelledby="recommendations-title">
	<span class="eyebrow">RECOMMENDATIONS / PREVIEW</span>
	<h2 id="recommendations-title"><?php esc_html_e( 'Recomendaciones', 'sinapsis_theme' ); ?></h2>
	<p class="user-page__intro"><?php esc_html_e( 'Próximamente se calcularán a partir de las categorías, dependencias y niveles de tus favoritos.', 'sinapsis_theme' ); ?></p>
</section>
