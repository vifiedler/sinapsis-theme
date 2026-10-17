<?php
function registrar_cpt_canciones()
{

    $labels = array(
        'name' => 'Canciones',
        'singular_name' => 'Canción',
        'menu_name' => 'Canciones',
        'name_admin_bar' => 'Canción',
        'add_new' => 'Añadir nueva',
        'add_new_item' => 'Añadir nueva canción',
        'new_item' => 'Nueva canción',
        'edit_item' => 'Editar canción',
        'view_item' => 'Ver canción',
        'all_items' => 'Todos los canciones',
        'search_items' => 'Buscar canción',
        'not_found' => 'No se encontraron canciones',
        'not_found_in_trash' => 'No se encontraron canciones en la papelera',
        'featured_image' => 'Imagen destacada',
        'set_featured_image' => 'Asignar imagen destacada',
        'remove_featured_image' => 'Quitar imagen destacada',
        'use_featured_image' => 'Usar como imagen destacada',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-format-audio',
        'rewrite' => array('slug' => 'canciones'),
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'),
        'menu_position' => 5,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'capability_type' => 'post',
    );

    register_post_type('canciones', $args);
}
add_action('init', 'registrar_cpt_canciones');

/*texonomía tipo de genero de los cancions */
function genero_cancion(){
    register_taxonomy(
        'genero_cancion',
        'canciones',
        array(
            'label' => __('Genero canción'),
            'rewrite' => array('slug' => 'genero-cancion'),
            'hierarchical' => true,
            // Allow cancionmatic creation of taxonomy columns on associated post-types table
            'show_admin_column' => true,
            // Show in quick edit panel
            'show_in_quick_edit' => true,
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'genero_cancion');