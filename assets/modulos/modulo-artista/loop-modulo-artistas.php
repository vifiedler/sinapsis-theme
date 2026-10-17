<?php
/**
 * Loop de artistas para el home
 * Muestra todos los artistas en formato de carrusel horizontal
 */
$args = array(
    'post_type'      => 'artista',
    'posts_per_page' => -1,
    'orderby'        => 'title',
    'order'          => 'ASC',
);
$query = new WP_Query($args);

if ($query->have_posts()) :
?>
<div class="bd-carousel-track" data-page="0">
    <?php while ($query->have_posts()) : $query->the_post();
            $img_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
            if (!$img_url) $img_url = 'https://via.placeholder.com/300x300?text=No+Image';
        ?>
    <a href="<?php the_permalink(); ?>" class="bd-card">
        <div class="bd-card-thumb-wrap">
            <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"
                class="bd-card-thumb" loading="lazy">
            <!-- No tiene botón de play, solo es un enlace al artista -->
        </div>
        <p class="bd-card-title"><?php the_title(); ?></p>
        <p class="bd-card-sub">Artista</p>
    </a>
    <?php endwhile; ?>
</div>
<?php
endif;
wp_reset_postdata();
?>