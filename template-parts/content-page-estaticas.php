<!-- <?php
/**
 * Plantilla genérica para páginas estáticas
 * Tema: sinapsis_theme
 */
get_header(); ?>

<main class="container my-5">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="mb-4 border-bottom pb-3">
                <h1 class="display-5 fw-bold"><?php the_title(); ?></h1>
            </header>
            
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; endif; ?>
</main>

<?php get_footer(); ?> -->