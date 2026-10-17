<?php
/**
 * Template part for displaying Terms & Conditions page content
 *
 * @package breakdownmusic-theme
 */

$terminos = get_field('terminos');

if (empty($terminos)) {
    echo '<p class="text-muted">No hay términos registrados.</p>';
    return;
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="entry-header mb-5 text-center text-md-start">
        <h1 class="entry-title display-4 fw-bold"><?php the_title(); ?></h1>
        <?php the_content(); ?>
    </div>

    <div class="entry-content">
        <?php
        ?>
        <div class="accordion" id="termsAccordion">
            <?php foreach ($terminos as $index => $termino):
                $item_id = 'termsHeading' . $index;
                $collapse_id = 'termsCollapse' . $index;
                $expanded = $index === 0 ? 'true' : 'false';
                $show = $index === 0 ? 'show' : '';
                $titulo = !empty($termino['titulo_terminos']) ? $termino['titulo_terminos'] : 'Término ' . ($index + 1);
                $respuesta = !empty($termino['respuesta_terminos']) ? $termino['respuesta_terminos'] : '';
                ?>
            <div class="accordion-item border-0 mb-3 rounded-3 overflow-hidden shadow-sm">
                <h2 class="accordion-header" id="<?php echo esc_attr($item_id); ?>">
                    <button
                        class="accordion-button <?php echo $index !== 0 ? 'collapsed' : ''; ?> bg-transparent text-white fw-bold py-3 px-4"
                        type="button" data-bs-toggle="collapse" data-bs-target="#<?php echo esc_attr($collapse_id); ?>"
                        aria-expanded="<?php echo esc_attr($expanded); ?>"
                        aria-controls="<?php echo esc_attr($collapse_id); ?>">
                        <span
                            class="me-3 text-danger fs-5"><?php echo str_pad($index + 1, 2, '0', STR_PAD_LEFT); ?></span>
                        <?php echo esc_html($titulo); ?>
                    </button>
                </h2>
                <div id="<?php echo esc_attr($collapse_id); ?>"
                    class="accordion-collapse collapse <?php echo esc_attr($show); ?>" role="region"
                    aria-labelledby="<?php echo esc_attr($item_id); ?>" data-bs-parent="#termsAccordion">
                    <div class="accordion-body bg-dark bg-opacity-50 text-light p-4">
                        <?php echo wp_kses_post($respuesta); ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div><!-- .entry-content -->
</article>