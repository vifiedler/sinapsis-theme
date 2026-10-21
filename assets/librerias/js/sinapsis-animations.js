( function() {
	'use strict';

	var motionQuery = window.matchMedia( '(prefers-reduced-motion: reduce)' );
	var anime = window.anime;

	if ( ! anime || motionQuery.matches ) {
		return;
	}

	function animateCards( cards ) {
		if ( ! cards.length ) {
			return;
		}

		anime( {
			targets: cards,
			opacity: [ 0, 1 ],
			translateY: [ 18, 0 ],
			delay: anime.stagger( 55 ),
			duration: 450,
			easing: 'easeOutCubic',
		} );
	}

	function animateDetail( detail ) {
		if ( ! detail ) {
			return;
		}

		anime( {
			targets: detail,
			opacity: [ 0, 1 ],
			translateY: [ 12, 0 ],
			duration: 300,
			easing: 'easeOutCubic',
		} );
	}

	function animateFavorite( favorite ) {
		anime( {
			targets: favorite,
			opacity: [ 0, 1 ],
			scale: [ 0.92, 1 ],
			duration: 300,
			easing: 'easeOutBack',
		} );
	}

	function initCatalogObserver() {
		var catalog = document.getElementById( 'library-catalog' );

		if ( ! catalog ) {
			return;
		}

		animateCards( Array.from( catalog.querySelectorAll( '.library-item' ) ) );
		new MutationObserver( function( mutations ) {
			var cards = [];
			var seen = [];

			mutations.forEach( function( mutation ) {
				mutation.addedNodes.forEach( function( node ) {
					if ( node.nodeType !== 1 ) {
						return;
					}

					if ( node.matches( '.library-item' ) && seen.indexOf( node ) === -1 ) {
						cards.push( node );
						seen.push( node );
					}
					Array.from( node.querySelectorAll( '.library-item' ) ).forEach( function( card ) {
						if ( seen.indexOf( card ) === -1 ) {
							cards.push( card );
							seen.push( card );
						}
					} );
				} );
			} );

			animateCards( cards );
		} ).observe( catalog, { childList: true, subtree: true } );
	}

	function initFavoriteObserver() {
		var zone = document.getElementById( 'zona-favoritos' );

		if ( ! zone ) {
			return;
		}

		zone.querySelectorAll( '.favorito-item' ).forEach( animateFavorite );
		new MutationObserver( function( mutations ) {
			mutations.forEach( function( mutation ) {
				mutation.addedNodes.forEach( function( node ) {
					if ( node.nodeType === 1 && node.matches( '.favorito-item' ) ) {
						animateFavorite( node );
					}
				} );
			} );
		} ).observe( zone, { childList: true } );
	}

	function initDetailsAnimation() {
		document.addEventListener( 'toggle', function( event ) {
			if ( event.target.matches( 'details.library-item[open]' ) ) {
				animateDetail( event.target.querySelector( '.library-detail' ) );
			}
		}, true );
	}

	function initSidebarAnimation() {
		var sidebar = document.querySelector( '.library-sidebar' );
		var filters = document.querySelectorAll( '[data-library-filter]' );

		if ( sidebar ) {
			anime( {
				targets: sidebar,
				opacity: [ 0, 1 ],
				translateX: [ -16, 0 ],
				duration: 500,
				easing: 'easeOutCubic',
			} );
		}

		if ( filters.length ) {
			anime( {
				targets: filters,
				opacity: [ 0, 1 ],
				translateX: [ -8, 0 ],
				delay: anime.stagger( 45, { start: 180 } ),
				duration: 300,
				easing: 'easeOutCubic',
			} );
		}
	}

	function initDropzoneAnimation() {
		var zone = document.getElementById( 'zona-favoritos' );

		if ( ! zone ) {
			return;
		}

		document.addEventListener( 'dragover', function( event ) {
			if ( event.target.closest( '#zona-favoritos' ) ) {
				anime( {
					targets: zone,
					scale: 1.02,
					duration: 180,
					easing: 'easeOutQuad',
				} );
			}
		} );

		document.addEventListener( 'dragleave', function( event ) {
			if ( event.target.closest( '#zona-favoritos' ) ) {
				anime( {
					targets: zone,
					scale: 1,
					duration: 180,
					easing: 'easeOutQuad',
				} );
			}
		} );
	}

	document.addEventListener( 'DOMContentLoaded', function() {
		initCatalogObserver();
		initFavoriteObserver();
		initDetailsAnimation();
		initSidebarAnimation();
		initDropzoneAnimation();
	} );
}() );
