<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package sinapsis_theme
 */

get_header();
?>

	<main id="primary" class="site-main container-fluid">

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content', 'single' );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
