<?php
/**
 * Loop específico para destacados.
 * Carga TODAS las canciones marcadas con el término 'destacadas'.
 */
$args = array(
    'post_type' => 'canciones',
    'posts_per_page' => -1,
    'orderby' => 'rand',
    'tax_query' => array(
        array(
            'taxonomy' => 'genero_cancion',
            'field' => 'slug',
            'terms' => 'destacadas',
        ),
    ),
);
$query = new WP_Query($args);

if ($query->have_posts()):
    ?>
    <div class="bd-carousel-track" data-page="0">
        <?php while ($query->have_posts()):
            $query->the_post();
            $artista_obj = get_field('artista');
            $artista_nombre = is_array($artista_obj) && !empty($artista_obj)
                ? $artista_obj[0]->post_title
                : 'Artista desconocido';
            $img_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
            if (!$img_url)
                $img_url = 'https://via.placeholder.com/300x300?text=No+Image';
            $url_cancion = get_field('url_cancion');
            ?>
            <a href="<?php the_permalink(); ?>" class="bd-card">
                <div class="bd-card-thumb-wrap">
                    <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"
                        class="bd-card-thumb" loading="lazy">
                    <?php if (!empty($url_cancion) && get_the_ID()): ?>
                        <span class="bd-play-btn" data-url="<?php echo esc_url($url_cancion); ?>"
                            data-post-id="<?php echo get_the_ID(); ?>">
                            <i class="bi bi-play-fill"></i>
                        </span>
                    <?php endif; ?>
                </div>
                <p class="bd-card-title"><?php the_title(); ?></p>
                <p class="bd-card-sub"><?php echo esc_html($artista_nombre); ?></p>
            </a>
        <?php endwhile; ?>
    </div>
    <?php
endif;
wp_reset_postdata();
?>