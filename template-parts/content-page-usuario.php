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

<?php if ( is_user_logged_in() ) : ?>
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
<?php else : ?>
	<section class="user-page__panel mb-4" aria-labelledby="user-login-title">
		<h2 id="user-login-title"><?php esc_html_e( 'Inicia sesión para ver tu espacio', 'sinapsis_theme' ); ?></h2>
		<p class="user-page__intro">
			<a href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>">
				<?php esc_html_e( 'Iniciar sesión', 'sinapsis_theme' ); ?>
			</a>
		</p>
	</section>
<?php endif; ?>

<section class="user-page__panel mb-4" aria-labelledby="favorites-title">
	<span class="eyebrow">COLLECTION / SAVED_ITEMS</span>
	<h2 id="favorites-title"><?php esc_html_e( 'Favoritos guardados', 'sinapsis_theme' ); ?></h2>
	<div
		id="favorites-list"
		class="user-page__items row g-3"
		data-favorites-endpoint="<?php echo esc_url( rest_url( 'wp/v2/posts' ) ); ?>"
		aria-live="polite"
	>
		<p class="user-page__intro"><?php esc_html_e( 'Cargando favoritos…', 'sinapsis_theme' ); ?></p>
	</div>
</section>

<section class="user-page__panel mb-4" aria-labelledby="recommendations-title">
	<span class="eyebrow">RECOMMENDATIONS / PREVIEW</span>
	<h2 id="recommendations-title"><?php esc_html_e( 'Recomendaciones', 'sinapsis_theme' ); ?></h2>
	<p class="user-page__intro">
		<?php esc_html_e( 'Sugerencias calculadas a partir de las categorías y niveles de dificultad de tus favoritos.', 'sinapsis_theme' ); ?>
	</p>
	<div
		id="recommendations-list"
		class="user-page__items row g-3"
		data-recommendations-endpoint="<?php echo esc_url( rest_url( 'wp/v2/posts' ) ); ?>"
		aria-live="polite"
	>
		<p class="user-page__intro"><?php esc_html_e( 'Calculando recomendaciones…', 'sinapsis_theme' ); ?></p>
	</div>
</section>
