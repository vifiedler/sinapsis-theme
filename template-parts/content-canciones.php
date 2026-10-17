<?php
/**
 * Template part for displaying a song card
 *
 * @package breakdownmusic-theme
 */

$artista_obj = get_field('artista');
$artista_nombre = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->post_title : 'Artista desconocido';
$img_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
if (!$img_url) $img_url = 'https://via.placeholder.com/300x300?text=No+Image';
$duracion_seg = get_field('duracion');
$duracion = $duracion_seg ? sprintf('%02d:%02d', floor($duracion_seg / 60), $duracion_seg % 60) : '';
$url_cancion = get_field('url_cancion');
?>

<div class="bd-song-card">
    <a href="<?php the_permalink(); ?>" class="d-block text-decoration-none">
        <div class="position-relative">
            <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"
                class="img-fluid w-100 rounded" style="aspect-ratio:1/1;object-fit:cover;">
            <button class="bd-play-btn position-absolute bottom-0 end-0 m-2 btn btn-danger rounded-circle p-0"
                data-url="<?php echo esc_url($url_cancion); ?>" data-post-id="<?php echo get_the_ID(); ?>"
                data-title="<?php echo esc_attr(get_the_title()); ?>"
                data-artist="<?php echo esc_attr($artista_nombre); ?>" data-thumb="<?php echo esc_url($img_url); ?>"
                style="width:42px;height:42px;opacity:0;transform:translateY(8px) scale(0.8);transition:all 0.2s ease;">
                <i class="bi bi-play-fill fs-4"></i>
            </button>
            <?php if ($duracion) : ?>
            <span
                class="position-absolute bottom-0 start-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 small rounded"><?php echo esc_html($duracion); ?></span>
            <?php endif; ?>
        </div>
    </a>
    <div class="mt-2">
        <p class="fw-semibold text-truncate mb-0"><?php the_title(); ?></p>
        <p class="text-secondary text-truncate small"><?php echo esc_html($artista_nombre); ?></p>
    </div>
</div>