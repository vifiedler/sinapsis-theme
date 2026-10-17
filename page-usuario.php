<?php
/**
 * Template Name: Usuario
 * Template Post Type: page
 *
 * @package sinapsis_theme
 */

get_header();
?>

<main id="primary" class="site-main user-page container-fluid">
	<?php
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/content', 'page-usuario' );
	endwhile;
	?>
</main>

<?php
get_footer();
