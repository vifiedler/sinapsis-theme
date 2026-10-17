<?php
/**
 * Loop de álbumes para el home
 * Muestra todos los álbumes en formato de carrusel horizontal
 */
$args = array(
    'post_type'      => 'album',
    'posts_per_page' => -1,
    'orderby'        => 'date',
    'order'          => 'DESC',
);
$query = new WP_Query($args);

if ($query->have_posts()) :
?>
<div class="bd-carousel-track" data-page="0">
    <?php while ($query->have_posts()) : $query->the_post();
            $img_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
            if (!$img_url) $img_url = 'https://via.placeholder.com/300x300?text=No+Image';
            // Obtener el artista del disco
            $artista_obj = get_field('artista');
            $artista_nombre = is_array($artista_obj) && !empty($artista_obj)
                ? $artista_obj[0]->post_title
                : 'Álbum';
        ?>
    <a href="<?php the_permalink(); ?>" class="bd-card">
        <div class="bd-card-thumb-wrap">
            <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"
                class="bd-card-thumb" loading="lazy">
            <!-- sin play, solo es enlace al álbum -->
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