<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package sinapsis_theme
 */

get_header();
?>

	<main id="primary" class="site-main">

		<header class="catalog-header">
			<div>
				<span class="eyebrow">CORE_CATALOG / SPEC_SHEETS_INDEX</span>
				<h1><?php esc_html_e( 'Catálogo de librerías JavaScript', 'sinapsis_theme' ); ?></h1>
				<p><?php esc_html_e( 'Explora recursos técnicos, guarda tus favoritos y consulta una ficha sin abandonar esta página.', 'sinapsis_theme' ); ?></p>
			</div>
			<div class="catalog-header__stats"><strong>06</strong><span><?php esc_html_e( 'módulos demo', 'sinapsis_theme' ); ?></span></div>
		</header>

		<div class="catalog-toolbar">
			<span class="eyebrow">ESTANTERÍA_01</span>
			<strong><?php esc_html_e( 'Layout, display y utilidades', 'sinapsis_theme' ); ?></strong>
			<span class="toolbar-note">06 COMPONENTES / GRID READY</span>
		</div>

		<div class="library-catalog">
			<?php
			$demo_items = array(
				array( 'id' => 'datatables', 'name' => 'DataTables', 'type' => 'jQuery Plugin', 'level' => 'Intermedio', 'category' => 'Display & Efectos', 'description' => 'Motor de indexación tabular para organizar grandes volúmenes de datos.', 'version' => 'v1.13.8', 'code' => "wp_enqueue_script( 'datatables' );" ),
				array( 'id' => 'select2', 'name' => 'Select2', 'type' => 'jQuery Plugin', 'level' => 'Básico', 'category' => 'Formularios', 'description' => 'Select avanzado para campos de selección con búsqueda y etiquetas.', 'version' => 'v4.1.0', 'code' => "jQuery( '.js-select2' ).select2();" ),
				array( 'id' => 'masonry', 'name' => 'Masonry', 'type' => 'JS Nativo', 'level' => 'Intermedio', 'category' => 'Layout & Estructura', 'description' => 'Mosaico asimétrico para tarjetas y contenidos editoriales.', 'version' => 'v4.2.2', 'code' => "const grid = document.querySelector( '.grid' );" ),
				array( 'id' => 'gsap', 'name' => 'GSAP', 'type' => 'JS Nativo', 'level' => 'Avanzado', 'category' => 'Animación Vectorial', 'description' => 'Animaciones de alta precisión para interfaces y transiciones.', 'version' => 'v3.12.5', 'code' => "gsap.to( '.box', { x: 100 } );" ),
				array( 'id' => 'swiper', 'name' => 'Swiper.js', 'type' => 'JS Nativo', 'level' => 'Intermedio', 'category' => 'Layout & Estructura', 'description' => 'Slider táctil y adaptable para galerías y carruseles.', 'version' => 'v11.1.0', 'code' => "new Swiper( '.swiper', { loop: true } );" ),
				array( 'id' => 'chartjs', 'name' => 'Chart.js', 'type' => 'JS Nativo', 'level' => 'Intermedio', 'category' => 'Display & Efectos', 'description' => 'Gráficos accesibles construidos sobre Canvas y datos simples.', 'version' => 'v4.4.1', 'code' => "new Chart( canvas, config );" ),
			);
			foreach ( $demo_items as $item ) :
				?>
				<details id="<?php echo esc_attr( $item['id'] ); ?>" class="library-item">
					<summary class="library-card">
						<div class="library-card__meta"><span class="module-id">MOD-<?php echo esc_html( strtoupper( substr( $item['id'], 0, 2 ) ) ); ?></span><span class="library-type"><?php echo esc_html( $item['type'] ); ?></span></div>
						<h2><?php echo esc_html( $item['name'] ); ?></h2>
						<div class="library-card__level"><span>NIVEL:</span> <?php echo esc_html( $item['level'] ); ?></div>
						<p><?php echo esc_html( $item['description'] ); ?></p>
						<div class="library-card__footer"><span><?php echo esc_html( $item['version'] ); ?></span><span class="show-label"><?php esc_html_e( 'Mostrar', 'sinapsis_theme' ); ?> <b>→</b></span></div>
					</summary>
					<div class="library-detail">
						<div><span class="eyebrow">INSPECTOR / <?php echo esc_html( strtoupper( $item['id'] ) ); ?></span><h2><?php echo esc_html( $item['name'] ); ?></h2><p><?php echo esc_html( $item['description'] ); ?></p></div>
						<div class="library-detail__code"><span>SNIPPET DE REFERENCIA</span><code><?php echo esc_html( $item['code'] ); ?></code></div>
						<div class="library-detail__actions"><button type="button" class="btn btn-outline-light btn-sm" disabled><?php esc_html_e( 'Añadir a favoritos', 'sinapsis_theme' ); ?></button><small><?php esc_html_e( 'Interacción disponible en la siguiente fase', 'sinapsis_theme' ); ?></small></div>
					</div>
				</details>
				<?php
			endforeach;
			?>
		</div>

	</main><!-- #main -->

<?php
get_footer();
