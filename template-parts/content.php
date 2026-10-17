<?php
$demo_items = array(
	array( 'id' => 'datatables', 'name' => 'DataTables', 'type' => 'jQuery Plugin', 'level' => 'Intermedio', 'description' => 'Motor de indexación tabular para organizar grandes volúmenes de datos.', 'version' => 'v1.13.8', 'code' => "wp_enqueue_script( 'datatables' );" ),
	array( 'id' => 'select2', 'name' => 'Select2', 'type' => 'jQuery Plugin', 'level' => 'Básico', 'description' => 'Select avanzado para campos de selección con búsqueda y etiquetas.', 'version' => 'v4.1.0', 'code' => "jQuery( '.js-select2' ).select2();" ),
	array( 'id' => 'masonry', 'name' => 'Masonry', 'type' => 'JS Nativo', 'level' => 'Intermedio', 'description' => 'Mosaico asimétrico para tarjetas y contenidos editoriales.', 'version' => 'v4.2.2', 'code' => "const grid = document.querySelector( '.grid' );" ),
	array( 'id' => 'gsap', 'name' => 'GSAP', 'type' => 'JS Nativo', 'level' => 'Avanzado', 'description' => 'Animaciones de alta precisión para interfaces y transiciones.', 'version' => 'v3.12.5', 'code' => "gsap.to( '.box', { x: 100 } );" ),
	array( 'id' => 'swiper', 'name' => 'Swiper.js', 'type' => 'JS Nativo', 'level' => 'Intermedio', 'description' => 'Slider táctil y adaptable para galerías y carruseles.', 'version' => 'v11.1.0', 'code' => "new Swiper( '.swiper', { loop: true } );" ),
	array( 'id' => 'chartjs', 'name' => 'Chart.js', 'type' => 'JS Nativo', 'level' => 'Intermedio', 'description' => 'Gráficos accesibles construidos sobre Canvas y datos simples.', 'version' => 'v4.4.1', 'code' => "new Chart( canvas, config );" ),
);
?>

<header class="catalog-header row align-items-end g-4">
	<div class="col-12 col-lg">
		<span class="eyebrow">CORE_CATALOG / SPEC_SHEETS_INDEX</span>
		<h1><?php esc_html_e( 'Catálogo de librerías JavaScript', 'sinapsis_theme' ); ?></h1>
		<p><?php esc_html_e( 'Explora recursos técnicos, guarda tus favoritos y consulta una ficha sin abandonar esta página.', 'sinapsis_theme' ); ?></p>
	</div>
	<div class="catalog-header__stats col-12 col-sm-auto"><strong>06</strong><span><?php esc_html_e( 'módulos demo', 'sinapsis_theme' ); ?></span></div>
</header>

<div class="catalog-toolbar d-flex flex-wrap align-items-center gap-2">
	<span class="eyebrow">ESTANTERÍA_01</span>
	<strong><?php esc_html_e( 'Layout, display y utilidades', 'sinapsis_theme' ); ?></strong>
	<span class="toolbar-note">06 COMPONENTES / GRID READY</span>
</div>

<div class="library-catalog row g-3">
	<?php foreach ( $demo_items as $item ) : ?>
		<details id="<?php echo esc_attr( $item['id'] ); ?>" class="library-item col-12 col-md-6 col-xl-4">
			<summary class="library-card d-flex flex-column">
				<div class="library-card__meta d-flex justify-content-between align-items-center"><span class="module-id">MOD-<?php echo esc_html( strtoupper( substr( $item['id'], 0, 2 ) ) ); ?></span><span class="library-type"><?php echo esc_html( $item['type'] ); ?></span></div>
				<h2 class="mt-4"><?php echo esc_html( $item['name'] ); ?></h2>
				<div class="library-card__level"><span>NIVEL:</span> <?php echo esc_html( $item['level'] ); ?></div>
				<p><?php echo esc_html( $item['description'] ); ?></p>
				<div class="library-card__footer d-flex justify-content-between align-items-center mt-auto"><span><?php echo esc_html( $item['version'] ); ?></span><span class="show-label"><?php esc_html_e( 'Mostrar', 'sinapsis_theme' ); ?> <b>→</b></span></div>
			</summary>
			<div class="library-detail row g-4">
				<div class="col-12 col-lg"><span class="eyebrow">INSPECTOR / <?php echo esc_html( strtoupper( $item['id'] ) ); ?></span><h2><?php echo esc_html( $item['name'] ); ?></h2><p><?php echo esc_html( $item['description'] ); ?></p></div>
				<div class="library-detail__code col-12 col-lg"><span>SNIPPET DE REFERENCIA</span><code><?php echo esc_html( $item['code'] ); ?></code></div>
				<div class="library-detail__actions col-12 col-lg-auto"><button type="button" class="btn btn-outline-light btn-sm" disabled><?php esc_html_e( 'Añadir a favoritos', 'sinapsis_theme' ); ?></button><small><?php esc_html_e( 'Interacción disponible en la siguiente fase', 'sinapsis_theme' ); ?></small></div>
			</div>
		</details>
	<?php endforeach; ?>
</div>
