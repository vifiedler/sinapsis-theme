<?php
if (!isset($artista_id) || !isset($artista_nombre))
    return;

$args = array(
    'post_type' => 'canciones',
    'posts_per_page' => 10,
    'orderby' => 'rand',
    'order' => 'DESC',
    'meta_query' => array(
        array(
            'key' => 'artista',
            'value' => '"' . $artista_id . '"',
            'compare' => 'LIKE',
        ),
    ),
);
$query = new WP_Query($args);

if ($query->have_posts()):
    $i = 1;
    ?>
<div class="container-fluid bd-artist-songs-list w-100">
    <?php while ($query->have_posts()):
            $query->the_post();
            $duracion_seg = get_field('duracion');
            $duracion = $duracion_seg ? sprintf('%02d:%02d', floor($duracion_seg / 60), $duracion_seg % 60) : '';
            $url_cancion = get_field('url_cancion');
            $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'thumbnail');
            if (!$thumb_url)
                $thumb_url = 'https://via.placeholder.com/42x42?text=No+Image';
            $title = get_the_title();
            ?>
    <div class="bd-artist-song-row d-flex align-items-center gap-3 p-2 rounded-3 w-100" data-id="<?php the_ID(); ?>">
        <!-- Botón de play + número -->
        <span class="d-flex align-items-center gap-1 flex-shrink-0" style="width:40px;">
            <button class="bd-play-btn-track bg-transparent border-0 text-secondary p-0"
                data-url="<?php echo esc_url($url_cancion); ?>" data-post-id="<?php echo get_the_ID(); ?>"
                data-thumb="<?php echo esc_url($thumb_url); ?>" data-title="<?php echo esc_attr($title); ?>"
                data-artist="<?php echo esc_attr($artista_nombre); ?>" title="Reproducir">
                <i class="bi bi-play-fill" style="font-size:1rem;"></i>
            </button>
            <span class="small text-secondary"><?php echo $i; ?></span>
        </span>

        <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_attr($title); ?>"
            class="bd-artist-song-thumb rounded-2 flex-shrink-0" style="width:42px;height:42px;object-fit:cover;">

        <div class="flex-grow-1 min-width-0">
            <p class="fw-semibold text-truncate mb-0">
                <a href="<?php the_permalink(); ?>" class="text-decoration-none"><?php echo esc_html($title); ?></a>
            </p>
            <p class="text-secondary text-truncate small mb-0"><?php echo esc_html($artista_nombre); ?></p>
        </div>

        <span class="text-secondary small flex-shrink-0"><?php echo esc_html($duracion); ?></span>
        <button class="bd-artist-song-like bg-transparent border-0 text-secondary flex-shrink-0"
            data-id="<?php the_ID(); ?>">
            <i class="bi bi-hand-thumbs-up"></i>
        </button>
    </div>
    <?php
            $i++;
        endwhile;
        ?>
</div>
<?php
    wp_reset_postdata();
endif;
?>