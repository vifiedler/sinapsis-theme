<?php
/**
 * CPT: Artista
 * Cada artista tiene sus propios campos (foto, bio, redes)
 */
function registrar_cpt_artista()
{
    $labels = array(
        'name' => 'Artistas',
        'singular_name' => 'Artista',
        'menu_name' => 'Artistas',
        'name_admin_bar' => 'Artista',
        'add_new' => 'Añadir nuevo',
        'add_new_item' => 'Añadir nuevo artista',
        'new_item' => 'Nuevo artista',
        'edit_item' => 'Editar artista',
        'view_item' => 'Ver artista',
        'all_items' => 'Todos los artistas',
        'search_items' => 'Buscar artista',
        'not_found' => 'No se encontraron artistas',
        'not_found_in_trash' => 'No se encontraron artistas en la papelera',
        'featured_image' => 'Foto del artista',
        'set_featured_image' => 'Asignar foto',
        'remove_featured_image' => 'Quitar foto',
        'use_featured_image' => 'Usar como foto de perfil',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-microphone',
        'rewrite' => array('slug' => 'artistas'),
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_position' => 6,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'capability_type' => 'post',
    );

    register_post_type('artista', $args);
}
add_action('init', 'registrar_cpt_artista');