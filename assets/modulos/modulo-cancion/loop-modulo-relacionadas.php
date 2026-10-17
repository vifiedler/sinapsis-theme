<?php
if (!isset($album_id_loop))
    return;

if (!isset($artista_nombre)) {
    $artista_nombre = 'Artista';
}
// Obtener la portada del disco si la canción no tiene imagen
$album_cover = get_the_post_thumbnail_url($album_id_loop, 'medium');
if (!$album_cover) {
    $album_cover = 'https://via.placeholder.com/300x300?text=No+Image';
}

$args = array(
    'post_type' => 'canciones',
    'posts_per_page' => -1,
    'orderby' => 'date',
    'order' => 'ASC',
    'meta_query' => array(
        array(
            'key' => 'album',
            'value' => '"' . $album_id_loop . '"',
            'compare' => 'LIKE',
        ),
    ),
);
$query = new WP_Query($args);

if ($query->have_posts()):
    while ($query->have_posts()):
        $query->the_post();
        $duracion_seg = get_field('duracion');
        $duracion = $duracion_seg ? sprintf('%02d:%02d', floor($duracion_seg / 60), $duracion_seg % 60) : '';
        $url_cancion = get_field('url_cancion');

        // Usar la imagen de la canción, o la del álbum
        $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
        if (!$thumb_url) {
            $thumb_url = $album_cover;
        }
        ?>
<div class="bd-song-card d-flex align-items-center gap-3 p-2 rounded-3">
    <div class="bd-song-thumb-wrap position-relative flex-shrink-0" style="width:52px;height:52px;">
        <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"
            class="w-100 h-100 rounded-2 object-fit-cover">
        <button
            class="bd-play-btn-track position-absolute top-50 start-50 translate-middle bg-danger border-0 rounded-circle d-flex align-items-center justify-content-center"
            data-url="<?php echo esc_url($url_cancion); ?>" data-post-id="<?php echo get_the_ID(); ?>"
            data-thumb="<?php echo esc_url($thumb_url); ?>"
            style="width:32px;height:32px;opacity:0;transition:opacity 0.2s;">
            <i class="bi bi-play-fill text-white" style="font-size:0.9rem;"></i>
        </button>
    </div>
    <div class="flex-grow-1 min-width-0">
        <p class="fw-semibold text-truncate mb-0">
            <a href="<?php the_permalink(); ?>" class="text-white text-decoration-none"><?php the_title(); ?></a>
        </p>
        <p class="text-secondary text-truncate small mb-0"><?php echo esc_html($artista_nombre); ?></p>
    </div>
    <button class="bd-track-like bg-transparent border-0 text-secondary" data-id="<?php the_ID(); ?>">
        <i class="bi bi-hand-thumbs-up"></i>
    </button>
    <span class="text-secondary small"><?php echo esc_html($duracion); ?></span>
</div>
<?php
    endwhile;
    wp_reset_postdata();
else:
    echo '<p class="text-muted">Este álbum no tiene canciones registradas.</p>';
endif;
?>