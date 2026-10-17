<?php
function js_function()
{
    if (!(is_admin())) {
        wp_register_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js', array('jquery'), '1', true);
        wp_register_script('anime-js', 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js', array(), '3.2.1', true);
        wp_register_script('custom-js', get_template_directory_uri() . '/assets/librerias/js/js-bdmusic.js', array('jquery', 'anime-js'), null, true);

        wp_enqueue_script('bootstrap-js');
        wp_enqueue_script('anime-js');
        wp_enqueue_script('custom-js');
//para llamar al AJAX
        wp_localize_script('custom-js', 'bd_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'rest_url' => rest_url('breakdown/v1/'),
            'nonce' => wp_create_nonce('bd_ajax_nonce'),
            'search_url' => home_url('/'),
        ));
    }
}
add_action("wp_enqueue_scripts", "js_function", 999);