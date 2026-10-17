<?php
add_filter('use_widgets_block_editor','__return_false');
function zona_widget(){
    /* Footer 1 — Logo */
    register_sidebar(
        array(
            'name'          => 'Footer columna 1',
            'id'            => 'footer_1',
            'before_widget' => '<div id="%1$s" class="d-flex justify-content-center mb-4">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="mb-3 d-none">',
            'after_title'   => '</h3>'
        )
    );
    /* Footer 2 — Links de navegación */
    register_sidebar(
        array(
            'name'          => 'Footer columna 2',
            'id'            => 'footer_2',
            'before_widget' => '<div id="%1$s" class="d-flex flex-wrap justify-content-center gap-3 fbs__footer-links mb-3">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="mb-3 d-none">',
            'after_title'   => '</h3>'
        )
    );
        /* Footer 3 — Copyright */
    register_sidebar(
        array(
            'name'          => 'Footer: Copyright',
            'id'            => 'footer_3',
            'before_widget' => '<div id="%1$s" class="d-flex justify-content-center fbs__footer-copy">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="d-none">',
            'after_title'   => '</h3>',
        )
    );

}
add_action('widgets_init', 'zona_widget');