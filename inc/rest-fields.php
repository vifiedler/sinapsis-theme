<?php
/**
 * REST representation for Sinapsis library posts.
 *
 * @package sinapsis_theme
 */

/**
 * Expose SCF catalog fields in the standard WordPress posts endpoint.
 */
function sinapsis_theme_register_rest_fields() {
	register_rest_field(
		'post',
		'sinapsis',
		array(
			'get_callback' => function ( $post ) {
				$post_id    = (int) $post['id'];
				$categories = get_the_category( $post_id );
				$type       = 'Librería';
				$shelves    = array();

				foreach ( $categories as $category ) {
					if ( 'plugin' === $category->slug ) {
						$type = 'Plugin';
						break;
					}
				}

				$terms = get_the_terms( $post_id, 'categoria-libreria' );
				if ( is_array( $terms ) ) {
					foreach ( $terms as $term ) {
						$shelves[] = array(
							'name' => $term->name,
							'slug' => $term->slug,
						);
					}
				}

				return array(
					'description'        => (string) sinapsis_theme_get_field( 'descripcion', $post_id ),
					'difficulty'         => (string) sinapsis_theme_get_field( 'dificultad', $post_id ),
					'installation_title' => (string) sinapsis_theme_get_field( 'titulo-instalacion', $post_id ),
					'installation'       => (string) sinapsis_theme_get_field( 'instalacion', $post_id ),
					'example_code'       => (string) sinapsis_theme_get_field( 'codigo-ejemplo', $post_id ),
					'link'               => esc_url_raw( (string) sinapsis_theme_get_field( 'link', $post_id ) ),
					'resource_type'      => $type,
					'image'             => sinapsis_theme_get_image_url( sinapsis_theme_get_field( 'imagen', $post_id ) ),
					'shelves'            => $shelves,
				);
			},
			'schema'       => array(
				'description' => __( 'Campos de catálogo de Sinapsis.', 'sinapsis_theme' ),
				'type'        => 'object',
				'context'     => array( 'view' ),
			),
		)
	);
}
add_action( 'rest_api_init', 'sinapsis_theme_register_rest_fields' );
