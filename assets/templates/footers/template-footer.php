<?php
/**
 * Widget-based footer template.
 *
 * @package sinapsis_theme
 */
?>

<footer id="colophon" class="sinapsis-footer mt-3">
	<div class="container-fluid">
		<div class="row">
			<?php if ( is_active_sidebar( 'footer_2' ) ) : ?>
				<?php dynamic_sidebar( 'footer_2' ); ?>
			<?php endif; ?>
		</div>
	</div>
</footer>
