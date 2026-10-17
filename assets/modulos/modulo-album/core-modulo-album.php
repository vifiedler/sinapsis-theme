<?php
/**
 * CPT: Álbum
 * Tiene datos propios (portada, año) y se conecta a Artista
 * mediante un campo SCF de tipo post_object, no una taxonomía.
 */
function registrar_cpt_album()
{
    $labels = array(
        'name' => 'Álbumes',
        'singular_name' => 'Álbum',
        'menu_name' => 'Álbumes',
        'name_admin_bar' => 'Álbum',
        'add_new' => 'Añadir nuevo',
        'add_new_item' => 'Añadir nuevo álbum',
        'new_item' => 'Nuevo álbum',
        'edit_item' => 'Editar álbum',
        'view_item' => 'Ver álbum',
        'all_items' => 'Todos los álbumes',
        'search_items' => 'Buscar álbum',
        'not_found' => 'No se encontraron álbumes',
        'not_found_in_trash' => 'No se encontraron álbumes en la papelera',
        'featured_image' => 'Portada del álbum',
        'set_featured_image' => 'Asignar portada',
        'remove_featured_image' => 'Quitar portada',
        'use_featured_image' => 'Usar como portada',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-album',
        'rewrite' => array('slug' => 'albumes'),
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_position' => 7,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'capability_type' => 'post',
    );

    register_post_type('album', $args);
}
add_action('init', 'registrar_cpt_album');