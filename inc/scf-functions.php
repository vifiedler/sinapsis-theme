<?php
/**
 * Helpers for fields supplied by Secure Custom Fields.
 *
 * @package sinapsis_theme
 */

/**
 * Get a field from SCF, with a post-meta fallback for local development.
 *
 * @param string   $field_name Field name.
 * @param int|null $post_id    Post ID.
 * @return mixed
 */
function sinapsis_theme_get_field( $field_name, $post_id = null ) {
	$post_id = $post_id ? $post_id : get_the_ID();

	if ( function_exists( 'get_field' ) ) {
		return get_field( $field_name, $post_id );
	}

	return get_post_meta( $post_id, $field_name, true );
}

/**
 * Return an image URL from the formats supported by SCF image fields.
 *
 * @param mixed $image Image field value.
 * @return string
 */
function sinapsis_theme_get_image_url( $image ) {
	if ( is_array( $image ) && ! empty( $image['url'] ) ) {
		return (string) $image['url'];
	}

	if ( is_numeric( $image ) ) {
		$image_url = wp_get_attachment_image_url( (int) $image, 'large' );
		return $image_url ? $image_url : '';
	}

	return is_string( $image ) ? $image : '';
}
