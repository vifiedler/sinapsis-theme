<?php
/**
 * Template part for displaying FAQ page content
 *
 * @package breakdownmusic-theme
 */

$faqs = get_field('faq_items');
if (!$faqs) {
    $faqs = array();
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="entry-header mb-5 text-center text-md-start">
        <h1 class="entry-title display-4 fw-bold"><?php echo get_the_title(); ?></h1>
        <?php the_content(); ?>
    </div>

    <div class="entry-content">

        <?php if (!empty($faqs)): ?>
        <div class="accordion" id="faqAccordion">
            <?php foreach ($faqs as $index => $faq):
                    $question = isset($faq['faq_pregunta']) ? $faq['faq_pregunta'] : '';
                    $answer = isset($faq['faq_respuesta']) ? $faq['faq_respuesta'] : '';
                    if (empty($question) || empty($answer))
                        continue;

                    $item_id = 'faqHeading' . $index;
                    $collapse_id = 'faqCollapse' . $index;
                    $expanded = $index === 0 ? 'true' : 'false';
                    $show = $index === 0 ? 'show' : '';
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
                        <?php echo esc_html($question); ?>
                    </button>
                </h2>
                <div id="<?php echo esc_attr($collapse_id); ?>"
                    class="accordion-collapse collapse <?php echo esc_attr($show); ?>" role="region"
                    aria-labelledby="<?php echo esc_attr($item_id); ?>" data-bs-parent="#faqAccordion">
                    <div class="accordion-body bg-dark bg-opacity-50 text-light p-4">
                        <?php echo wp_kses_post($answer); ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <p class="text-muted">No hay preguntas frecuentes disponibles en este momento.</p>
        <?php endif; ?>

    </div><!-- .entry-content -->
</article>