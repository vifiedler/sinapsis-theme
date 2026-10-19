<?php
/**
 * Menu registration, walker and authentication links.
 *
 * @package sinapsis_theme
 */

/**
 * Enqueue the top navigation stylesheet.
 */
function sinapsis_theme_enqueue_menu_styles() {
	wp_enqueue_style(
		'sinapsis-theme-menus',
		get_template_directory_uri() . '/assets/templates/navs/nav.css',
		array(),
		_S_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'sinapsis_theme_enqueue_menu_styles' );

/**
 * Register the menu location used by the top navigation.
 */
function sinapsis_theme_register_menus() {
	register_nav_menus(
		array(
			'menu-superior' => esc_html__( 'Menú superior', 'sinapsis_theme' ),
		)
	);
}
add_action( 'init', 'sinapsis_theme_register_menus' );

/**
 * Add Bootstrap-compatible classes to top navigation items.
 *
 * @param string[]  $classes Menu item classes.
 * @param WP_Post   $item    Menu item.
 * @param stdClass  $args    Menu arguments.
 * @return string[]
 */
function sinapsis_theme_menu_classes( $classes, $item, $args ) {
	if ( isset( $args->theme_location ) && 'menu-superior' === $args->theme_location ) {
		$classes[] = 'nav-item';
	}

	return $classes;
}
add_filter( 'nav_menu_css_class', 'sinapsis_theme_menu_classes', 10, 3 );

/**
 * Bootstrap-compatible WordPress menu walker.
 */
class Sinapsis_Theme_Nav_Menu_Walker extends Walker_Nav_Menu {

	/**
	 * Render a submenu level.
	 *
	 * @param string   $output Used to append the generated markup.
	 * @param int      $depth  Current depth.
	 * @param stdClass $args   Menu arguments.
	 */
	public function start_lvl( &$output, $depth = 0, $args = null ) {
		$indent  = str_repeat( "\t", $depth );
		$submenu = $depth > 0 ? ' sub-menu' : '';
		$output .= "\n{$indent}<ul class=\"dropdown-menu{$submenu} depth_{$depth}\">\n";
	}

	/**
	 * Render a menu item.
	 *
	 * @param string   $output Used to append the generated markup.
	 * @param WP_Post  $item   Menu item.
	 * @param int      $depth  Current depth.
	 * @param stdClass $args   Menu arguments.
	 * @param int      $id     Current item ID.
	 */
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$indent = $depth ? str_repeat( "\t", $depth ) : '';
		$classes = empty( $item->classes ) ? array() : (array) $item->classes;

		$classes[] = 'nav-item';
		if ( $args->walker->has_children ) {
			$classes[] = 'dropdown';
		}
		if ( in_array( 'current-menu-item', $classes, true ) ) {
			$classes[] = 'active';
		}

		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
		$item_id     = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args );
		$item_id     = $item_id ? ' id="' . esc_attr( $item_id ) . '"' : '';

		$output .= $indent . '<li' . $item_id . $class_names . '>';

		$attributes = array(
			'title'  => ! empty( $item->attr_title ) ? $item->attr_title : '',
			'target' => ! empty( $item->target ) ? $item->target : '',
			'rel'    => ! empty( $item->xfn ) ? $item->xfn : '',
			'href'   => ! empty( $item->url ) ? $item->url : '#',
			'class'  => $args->walker->has_children ? 'nav-link dropdown-toggle' : 'nav-link',
		);

		if ( $args->walker->has_children ) {
			$attributes['data-bs-toggle'] = 'dropdown';
			$attributes['aria-expanded'] = 'false';
		}

		$attributes = apply_filters( 'nav_menu_link_attributes', $attributes, $item, $args );
		$attribute_string = '';

		foreach ( $attributes as $attribute => $value ) {
			if ( '' !== $value && false !== $value ) {
				$value = 'href' === $attribute ? esc_url( $value ) : esc_attr( $value );
				$attribute_string .= ' ' . $attribute . '="' . $value . '"';
			}
		}

		$item_output  = $args->before;
		$item_output .= '<a' . $attribute_string . '>';
		$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}
