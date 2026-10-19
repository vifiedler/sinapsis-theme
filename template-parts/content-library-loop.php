<?php
/**
 * REST-powered card loop for the home catalog.
 *
 * The cards are populated by sinapsis-rest.js from /wp-json/wp/v2/posts.
 */
$loop_config = array(
	'endpoint' => rest_url( 'wp/v2/posts' ),
	'per_page' => 100,
);
?>
<div
	id="library-catalog"
	class="library-catalog"
	aria-live="polite"
	data-rest-endpoint="<?php echo esc_url( $loop_config['endpoint'] ); ?>"
	data-per-page="<?php echo esc_attr( $loop_config['per_page'] ); ?>"
>
	<p class="catalog-status"><?php esc_html_e( 'Cargando módulos...', 'sinapsis_theme' ); ?></p>
</div>
