<?php
if (!isset($artista_id_loop) || empty($artista_id_loop)) {
    echo '<p class="text-muted">No hay canciones de este artista.</p>';
    return;
}

if (!isset($artista_nombre)) {
    $artista_nombre = 'Artista';
}

$args = array(
    'post_type'      => 'canciones',
    'posts_per_page' => 10,
    'orderby'        => 'rand',
    'meta_query'     => array(
        array(
            'key'     => 'artista',
            'value'   => '"' . $artista_id_loop . '"',
            'compare' => 'LIKE',
        ),
    ),
    'post__not_in'   => array(get_the_ID()),
);
$query = new WP_Query($args);

if ($query->have_posts()) :
    $i = 1;
    while ($query->have_posts()) : $query->the_post();
        $duracion_seg = get_field('duracion');
        $duracion = $duracion_seg ? sprintf('%02d:%02d', floor($duracion_seg / 60), $duracion_seg % 60) : '';
        $url_cancion = get_field('url_cancion');
        $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
        if (!$thumb_url) $thumb_url = 'https://via.placeholder.com/300x300?text=No+Image';
        $title = get_the_title();
?>
<div class="bd-track-row d-flex align-items-center gap-3 p-2 rounded-3" data-id="<?php the_ID(); ?>">
    <span class="bd-track-num">
        <button class="bd-play-btn-track bg-transparent border-0 text-secondary p-0"
            data-url="<?php echo esc_url($url_cancion); ?>" data-post-id="<?php echo get_the_ID(); ?>"
            data-thumb="<?php echo esc_url($thumb_url); ?>" data-title="<?php echo esc_attr($title); ?>"
            data-artist="<?php echo esc_attr($artista_nombre); ?>" title="Reproducir">
            <i class="bi bi-play-fill"></i>
        </button>
    </span>
    <div class="flex-grow-1 min-width-0">
        <p class="fw-semibold text-truncate mb-0">
            <a href="<?php the_permalink(); ?>" class="text-decoration-none"><?php echo esc_html($title); ?></a>
        </p>
        <p class="text-secondary text-truncate small mb-0"><?php echo esc_html($artista_nombre); ?></p>
    </div>
    <button class="bd-track-like bg-transparent border-0 text-secondary" data-id="<?php the_ID(); ?>">
        <i class="bi bi-hand-thumbs-up"></i>
    </button>
    <span class="text-secondary small"><?php echo esc_html($duracion); ?></span>
</div>
<?php
        $i++;
    endwhile;
    wp_reset_postdata();
else :
    echo '<p class="text-muted">No hay más canciones de este artista.</p>';
endif;
?>