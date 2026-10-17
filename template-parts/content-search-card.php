<?php
/**
 * Template part for displaying search results as a card
 *
 * @package breakdownmusic-theme
 */

// Obtener datos según tipo post
$post_type = get_post_type();
$img_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
if (!$img_url) {
	$img_url = 'https://via.placeholder.com/300x300?text=No+Image';
}

$title = get_the_title();
$permalink = get_permalink();
$subtitle = '';

// Determinar subtítulo según el tipo
if ($post_type === 'canciones') {
	$artista_obj = get_field('artista');
	$subtitle = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->post_title : 'Artista desconocido';
} elseif ($post_type === 'album') {
	$artista_obj = get_field('artista');
	$subtitle = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->post_title : 'Artista desconocido';
	$anio = get_field('anio_lanzamiento');
	if ($anio) {
		$subtitle .= ' • ' . $anio;
	}
} elseif ($post_type === 'artista') {
	$subtitle = 'Artista';
} else {
	$subtitle = get_post_type_object($post_type)->labels->singular_name ?? 'Entrada';
}

// Si es una canción obtiene URL para play
$url_cancion = ($post_type === 'canciones') ? get_field('url_cancion') : '';
?>

<div class="bd-card h-100">
    <a href="<?php echo esc_url($permalink); ?>" class="d-block text-decoration-none text-white">
        <div class="bd-card-thumb-wrap">
            <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($title); ?>" class="bd-card-thumb"
                loading="lazy">
            <?php if ($post_type === 'canciones' && $url_cancion): ?>
            <button class="bd-play-btn" data-url="<?php echo esc_url($url_cancion); ?>"
                data-post-id="<?php echo get_the_ID(); ?>">
                <i class="bi bi-play-fill"></i>
            </button>
            <?php endif; ?>
        </div>
        <p class="bd-card-title"><?php echo esc_html($title); ?></p>
        <p class="bd-card-sub"><?php echo esc_html($subtitle); ?></p>
    </a>
</div>