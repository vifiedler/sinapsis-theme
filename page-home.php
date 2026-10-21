<?php
/**
 * Template Name: Home
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package sinapsis_theme
 */

get_header();
?>

	<main id="primary" class="site-main container-fluid">

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'assets/modulos/loop-recomendaciones' );
			get_template_part( 'template-parts/content', 'page' );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
