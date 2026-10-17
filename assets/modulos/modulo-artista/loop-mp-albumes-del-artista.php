<?php
if (!isset($artista_id) || !isset($artista_nombre)) return;

$args = array(
    'post_type'      => 'album',
    'posts_per_page' => -1,
    'orderby'        => 'date',
    'order'          => 'DESC',
    'meta_query'     => array(
        array(
            'key'     => 'artista',
            'value'   => '"' . $artista_id . '"',
            'compare' => 'LIKE',
        ),
    ),
);
$query = new WP_Query($args);

if ($query->have_posts()) :
?>
    <div class="bd-carousel-track" data-page="0">
        <?php while ($query->have_posts()) : $query->the_post();
            $img_album = get_the_post_thumbnail_url(get_the_ID(), 'medium');
            if (!$img_album) $img_album = 'https://via.placeholder.com/300x300?text=No+Image';
        ?>
            <a href="<?php the_permalink(); ?>" class="bd-card">
                <div class="bd-card-thumb-wrap">
                    <img src="<?php echo esc_url($img_album); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" class="bd-card-thumb">
                    <span class="bd-play-btn" data-id="<?php the_ID(); ?>"><i class="bi bi-play-fill"></i></span>
                </div>
                <p class="bd-card-title"><?php the_title(); ?></p>
                <p class="bd-card-sub"><?php echo esc_html($artista_nombre); ?></p>
            </a>
        <?php endwhile; ?>
    </div>
<?php
    wp_reset_postdata();
else :
    echo '<p class="text-muted">Este artista aún no tiene álbumes.</p>';
endif;
?>