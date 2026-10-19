<?php
/**
 * REST-powered card loop for the home catalog.
 *
 * The cards are populated by js-sinapsis.js from /wp-json/wp/v2/posts.
 */
?>
<div id="library-catalog" class="library-catalog" aria-live="polite">
	<p class="catalog-status"><?php esc_html_e( 'Cargando módulos...', 'sinapsis_theme' ); ?></p>
</div>
