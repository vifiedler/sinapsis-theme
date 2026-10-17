<?php
/**
 * Template part for displaying album single
 *
 * @package breakdownmusic-theme
 */

$artista_obj = get_field('artista');
$artista_nombre = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->post_title : 'Artista desconocido';
$artista_id = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->ID : 0;
$anio = get_field('anio_lanzamiento');
$descripcion = get_field('descripcion');
$img_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
if (!$img_url) {
	$img_url = 'https://via.placeholder.com/600x600?text=No+Image';
}

// Obtener el género más común entre todas las canciones del álbum
$album_songs = get_posts(array(
	'post_type' => 'canciones',
	'posts_per_page' => -1,
	'meta_query' => array(
		array(
			'key' => 'album',
			'value' => '"' . get_the_ID() . '"',
			'compare' => 'LIKE',
		),
	),
));
$genero_slug = '';
$genero_nombre = '';
if (!empty($album_songs)) {
	$genero_counts = array();
	foreach ($album_songs as $song) {
		$terms = wp_get_post_terms($song->ID, 'genero_cancion');
		if (!empty($terms) && !is_wp_error($terms)) {
			$slug = $terms[0]->slug;
			$name = $terms[0]->name;
			if (!isset($genero_counts[$slug])) {
				$genero_counts[$slug] = array('count' => 0, 'name' => $name);
			}
			$genero_counts[$slug]['count']++;
		}
	}
	if (!empty($genero_counts)) {
		// Ordenar por count descendente y tomar el primero
		uasort($genero_counts, function ($a, $b) {
			return $b['count'] - $a['count'];
		});
		$first = reset($genero_counts);
		$genero_slug = key($genero_counts);
		$genero_nombre = $first['name'];
	}
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="row g-4 bd-single-layout">

        <!-- Columna izquierda: info del disco -->
        <div class="col-lg-4 col-xl-3 bd-single-info">
            <?php if ($artista_id): ?>
            <a href="<?php echo get_permalink($artista_id); ?>"
                class="d-flex align-items-center gap-2 text-decoration-none small fw-semibold mb-3 bd-single-breadcrumb">
                <i class="bi bi-music-note-beamed text-danger"></i>
                <span><?php echo esc_html($artista_nombre); ?></span>
            </a>
            <?php else: ?>
            <span class="d-flex align-items-center gap-2 small fw-semibold mb-3 bd-single-breadcrumb">
                <i class="bi bi-music-note-beamed text-danger"></i>
                <span><?php echo esc_html($artista_nombre); ?></span>
            </span>
            <?php endif; ?>
            <!-- Portada -->
            <div class="bd-single-cover mb-3">
                <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>"
                    class="img-fluid rounded-3 shadow">
            </div>
            <!-- Título -->
            <h1 class="bd-single-title h2 fw-bold"><?php the_title(); ?></h1>
            <!-- Info extra -->
            <div class="d-flex flex-column gap-1 small mb-3">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-person-fill"></i>
                    <?php if ($artista_id): ?>
                    <a href="<?php echo get_permalink($artista_id); ?>"
                        class="text-decoration-none"><?php echo esc_html($artista_nombre); ?></a>
                    <?php else: ?>
                    <?php echo esc_html($artista_nombre); ?>
                    <?php endif; ?>
                </div>
                <?php if ($anio): ?>
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-calendar-fill"></i> <?php echo esc_html($anio); ?>
                </div>
                <?php endif; ?>
            </div>
            <!-- Descripción -->
            <?php if ($descripcion): ?>
            <p class="bd-single-desc small"><?php echo wp_kses_post($descripcion); ?></p>
            <?php endif; ?>
            <!-- botones debajo -->
            <div class="d-flex align-items-center gap-3 mt-3 bd-single-actions">
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" title="Descargar">
                    <i class="bi bi-download"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" id="bd-save-btn"
                    title="Guardar">
                    <i class="bi bi-bookmark-fill"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" title="Compartir">
                    <i class="bi bi-share-fill"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" title="Más opciones">
                    <i class="bi bi-three-dots"></i>
                </button>
            </div>
        </div>
        <!-- Columna derecha: canciones del disco + género -->
        <div class="col-lg-8 col-xl-9 bd-single-tracklist">
            <!-- Canciones del disco -->
            <h2 class="h5 fw-bold mb-3">Canciones del álbum</h2>
            <?php
			$album_id_loop = get_the_ID();
			include get_template_directory() . '/assets/modulos/modulo-album/loop-mp-canciones-del-album.php';
			?>
            <!-- Sección: Otras canciones -->
            <?php if ($genero_slug): ?>
            <hr class="my-4 border-secondary">
            <h2 class="h5 fw-bold mb-3">Otras canciones de <?php echo esc_html($genero_nombre); ?></h2>
            <div id="bd-genre-songs-container" data-genre="<?php echo esc_attr($genero_slug); ?>"
                data-album-id="<?php the_ID(); ?>" data-page="1" data-total-pages="0">
                <div id="bd-genre-songs-list" class="bd-song-grid">
                    <!-- Se llenará via AJAX -->
                </div>
                <div id="bd-genre-loader" class="text-center py-3" style="display:none;">
                    <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
                <div id="bd-genre-end" class="text-center text-muted small py-3" style="display:none;">
                    No hay más canciones de este género.
                </div>
            </div>
            <?php endif; ?>
        </div>

    </div>
</article>