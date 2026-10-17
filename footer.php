<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package sinapsis_theme
 */

?>

	<footer id="colophon" class="site-footer">
		<div class="site-info">
			<?php
			printf(
				/* translators: %s: current year. */
				esc_html__( 'Sinapsis %s', 'sinapsis_theme' ),
				esc_html( gmdate( 'Y' ) )
			);
			?>
		</div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
