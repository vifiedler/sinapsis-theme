<?php
/**
 * Template part for displaying single canción
 *
 * @package breakdownmusic-theme
 */

// Datos SCF
$artista_obj = get_field('artista');
$album_obj = get_field('album');
$duracion_seg = get_field('duracion');
$url_cancion = get_field('url_cancion');
$descripcion = get_the_content();

// Formato duración
$duracion = $duracion_seg ? sprintf('%02d:%02d', floor($duracion_seg / 60), $duracion_seg % 60) : '';

// Nombres e ID
$artista_nombre = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->post_title : 'Artista desconocido';
$artista_id = is_array($artista_obj) && !empty($artista_obj) ? $artista_obj[0]->ID : 0;
$album_titulo = is_array($album_obj) && !empty($album_obj) ? $album_obj[0]->post_title : 'Álbum desconocido';
$album_id = is_array($album_obj) && !empty($album_obj) ? $album_obj[0]->ID : 0;

// Portada
$img_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
if (!$img_url && $album_id) {
	$img_url = get_the_post_thumbnail_url($album_id, 'full');
}
if (!$img_url) {
	$img_url = 'https://via.placeholder.com/600x600?text=No+Image';
}

// Año del álbum
$anio_album = $album_id ? get_field('anio_lanzamiento', $album_id) : '';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="row g-4 bd-single-layout">

        <!-- Columna izquierda: info de la canción -->
        <div class="col-lg-4 col-xl-3 bd-single-info">
            <!-- Breadcrumb artista -->
            <?php if ($artista_id): ?>
            <a href="<?php echo get_permalink($artista_id); ?>"
                class="d-flex align-items-center gap-2 text-decoration-none small fw-semibold mb-3 bd-single-breadcrumb">
                <i class="bi bi-music-note-beamed text-danger"></i>
                <span id="bd-single-artista"><?php echo esc_html($artista_nombre); ?></span>
            </a>
            <?php else: ?>
            <span class="d-flex align-items-center gap-2 text-muted small fw-semibold mb-3 bd-single-breadcrumb">
                <i class="bi bi-music-note-beamed text-danger"></i>
                <span id="bd-single-artista"><?php echo esc_html($artista_nombre); ?></span>
            </span>
            <?php endif; ?>

            <!-- Portada -->
            <div class="bd-single-cover mb-3">
                <img id="bd-single-cover-img" src="<?php echo esc_url($img_url); ?>"
                    alt="<?php echo esc_attr(get_the_title()); ?>" class="img-fluid rounded-3 shadow">
            </div>

            <!-- Título -->
            <h1 class="bd-single-title h2 fw-bold" id="bd-single-titulo"><?php the_title(); ?></h1>

            <!-- Otra info -->
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
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-disc-fill"></i>
                    <?php if ($album_id): ?>
                    <a href="<?php echo get_permalink($album_id); ?>"
                        class="text-decoration-none"><?php echo esc_html($album_titulo); ?></a>
                    <?php else: ?>
                    <?php echo esc_html($album_titulo); ?>
                    <?php endif; ?>
                    <?php if ($anio_album): ?>
                    <span class="">• <?php echo esc_html($anio_album); ?></span>
                    <?php endif; ?>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-clock-fill"></i> <?php echo esc_html($duracion); ?>
                </div>
            </div>
            <!-- Acciones -->
            <div class="d-flex align-items-center gap-3 mt-3 bd-single-actions">
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" title="Descargar">
                    <i class="bi bi-download"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" id="bd-save-btn"
                    title="Guardar">
                    <i class="bi bi-bookmark-fill"></i>
                </button>
                <button class="btn btn-light btn-lg rounded-circle bd-action-btn bd-play-main" id="bd-play-main"
                    title="Reproducir" data-url="<?php echo esc_url($url_cancion); ?>"
                    data-post-id="<?php echo get_the_ID(); ?>">
                    <i class="bi bi-play-fill"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" title="Compartir">
                    <i class="bi bi-share-fill"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm rounded-circle bd-action-btn" title="Más opciones">
                    <i class="bi bi-three-dots"></i>
                </button>

            </div>
        </div>

        <!-- Columna derecha: canciones del mismo artista -->
        <div class="col-lg-8 col-xl-9 bd-single-tracklist me-3" id="bd-tracklist">
            <h2 class="h5 fw-bold mb-3">Canciones de <?php echo esc_html($artista_nombre); ?></h2>
            <?php
			$artista_id_loop = $artista_id;
			include get_template_directory() . '/assets/modulos/modulo-cancion/loop-mp-relacionadas-artista.php';
			?>
        </div>

    </div>
</article>