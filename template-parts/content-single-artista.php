<?php
/**
 * Template part for displaying artista single
 *
 * @package breakdownmusic-theme
 */

$artista_nombre = get_the_title();
$artista_id = get_the_ID();
$biografia = get_field('biografia');
$img_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
if (!$img_url) {
    $img_url = 'https://via.placeholder.com/600x600?text=No+Image';
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <!-- Hero del artista -->
    <div class="bd-artist-hero mb-4" style="background-image: url('<?php echo esc_url($img_url); ?>');">
        <div class="bd-artist-hero-overlay p-4 p-md-5">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h1 class="bd-artist-name display-3 fw-bold"><?php the_title(); ?></h1>
                        <?php if ($biografia): ?>
                        <p class="bd-artist-bio text-light" id="bd-artist-bio"><?php echo get_field('biografia'); ?>
                        </p>
                        <?php endif; ?>
                        <div class="bd-artist-actions d-flex flex-wrap gap-2 mt-3">
                            <button class="bd-btn-pill btn btn-outline-light">
                                <i class="bi bi-shuffle"></i> Aleatorio
                            </button>
                            <button class="bd-btn-pill btn btn-outline-light">
                                <i class="bi bi-broadcast"></i> Mix
                            </button>
                            <button class="bd-btn-subscribe btn btn-outline-danger"
                                id="bd-subscribe-btn">Suscribirse</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Canciones del artista -->
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="bd-section-title h3 fw-bold">Canciones</h2>
                    <div class="bd-section-controls d-flex align-items-center gap-2">
                        <a href="<?php echo get_permalink($artista_id); ?>"
                            class="btn btn-outline-light btn-sm bd-more-btn">Ver más</a>
                    </div>
                </div>
                <?php include get_template_directory() . '/assets/modulos/modulo-artista/loop-mp-canciones-del-artista.php'; ?>
            </div>
        </div>
    </div>

    <!-- Álbumes del artista -->
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="bd-section-title h3 fw-bold">Álbumes</h2>
                    <div class="bd-section-controls d-flex align-items-center gap-2">
                        <a href="<?php echo get_permalink($artista_id); ?>"
                            class="btn btn-outline-light btn-sm bd-more-btn">Ver más</a>
                    </div>
                </div>
                <?php include get_template_directory() . '/assets/modulos/modulo-artista/loop-mp-albumes-del-artista.php'; ?>
            </div>
        </div>
    </div>

</article>