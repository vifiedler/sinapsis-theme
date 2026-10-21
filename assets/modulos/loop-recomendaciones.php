<?php
/**
 * REST-powered recommendations carousel for the home page.
 *
 * @package sinapsis_theme
 */
?>
<section
	class="home-recommendations"
	aria-labelledby="home-recommendations-title"
	data-recommendations-endpoint="<?php echo esc_url( rest_url( 'wp/v2/posts' ) ); ?>"
	data-user-logged-in="<?php echo is_user_logged_in() ? 'true' : 'false'; ?>"
>
	<div class="home-recommendations__header">
		<span class="eyebrow"><?php esc_html_e( 'DISCOVER / RECOMMENDATIONS', 'sinapsis_theme' ); ?></span>
		<h2 id="home-recommendations-title"><?php esc_html_e( 'Recomendaciones para ti', 'sinapsis_theme' ); ?></h2>
	</div>
	<div class="home-recommendations__carousel" aria-live="polite">
		<p class="catalog-status"><?php esc_html_e( 'Cargando recomendaciones...', 'sinapsis_theme' ); ?></p>
	</div>
</section>
