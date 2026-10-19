( function() {
	'use strict';

	var storageKey = 'sinapsis_favoritos';

	function appendFavorite( zone, data ) {
		var favorite = document.createElement( 'div' );
		var remove = document.createElement( 'button' );

		favorite.className = 'favorito-item';
		favorite.dataset.id = data.id;
		favorite.appendChild( document.createTextNode( data.nombre ) );

		remove.className = 'favorito-item__remove';
		remove.type = 'button';
		remove.setAttribute( 'aria-label', 'Eliminar ' + data.nombre + ' de favoritos' );
		remove.textContent = '×';
		favorite.appendChild( remove );
		zone.appendChild( favorite );
		zone.querySelectorAll( '.texto-vacio' ).forEach( function( element ) {
			element.style.display = 'none';
		} );
	}

	function readFavorites() {
		try {
			return JSON.parse( localStorage.getItem( storageKey ) || '[]' );
		} catch ( error ) {
			console.error( 'No fue posible leer los favoritos:', error );
			return [];
		}
	}

	function saveFavorites( favorites ) {
		try {
			localStorage.setItem( storageKey, JSON.stringify( favorites ) );
		} catch ( error ) {
			console.error( 'No fue posible guardar los favoritos:', error );
		}
	}

	function restoreFavorites() {
		var zone = document.getElementById( 'zona-favoritos' );

		if ( ! zone ) {
			return;
		}

		readFavorites().forEach( function( favorite ) {
			if ( favorite.id && favorite.nombre && ! zone.querySelector( '[data-id="' + favorite.id + '"]' ) ) {
				appendFavorite( zone, favorite );
			}
		} );
	}

	function initFavorites() {
		var zone = document.getElementById( 'zona-favoritos' );

		if ( ! zone ) {
			return;
		}

		document.addEventListener( 'dragstart', function( event ) {
			var card = event.target.closest( '.library-item' );

			if ( ! card ) {
				return;
			}

			event.dataTransfer.setData( 'text/plain', JSON.stringify( {
				id: card.dataset.id,
				nombre: card.dataset.nombre,
			} ) );
			event.dataTransfer.effectAllowed = 'copy';
			card.style.opacity = '0.5';
		} );

		document.addEventListener( 'dragend', function( event ) {
			var card = event.target.closest( '.library-item' );

			if ( card ) {
				card.style.opacity = '1';
			}
		} );

		document.addEventListener( 'dragover', function( event ) {
			if ( event.target.closest( '#zona-favoritos' ) ) {
				event.preventDefault();
				zone.classList.add( 'is-dragover' );
			}
		} );

		document.addEventListener( 'dragleave', function( event ) {
			if ( event.target.closest( '#zona-favoritos' ) ) {
				zone.classList.remove( 'is-dragover' );
			}
		} );

		document.addEventListener( 'drop', function( event ) {
			var data;
			var dataString;

			if ( ! event.target.closest( '#zona-favoritos' ) ) {
				return;
			}

			event.preventDefault();
			zone.classList.remove( 'is-dragover' );
			dataString = event.dataTransfer.getData( 'text/plain' );

			if ( ! dataString ) {
				return;
			}

			try {
				data = JSON.parse( dataString );
			} catch ( error ) {
				console.error( 'Error leyendo el módulo arrastrado:', error );
				return;
			}

			if ( ! data.id || ! data.nombre || zone.querySelector( '[data-id="' + data.id + '"]' ) ) {
				return;
			}

			appendFavorite( zone, data );
			saveFavorites( readFavorites().concat( [ data ] ) );
		} );

		document.addEventListener( 'click', function( event ) {
			var removeButton = event.target.closest( '.favorito-item__remove' );
			var favorite;
			var id;

			if ( ! removeButton ) {
				return;
			}

			favorite = removeButton.closest( '.favorito-item' );
			id = favorite && favorite.dataset.id;

			if ( ! id ) {
				return;
			}

			favorite.remove();
			saveFavorites( readFavorites().filter( function( item ) {
				return item.id !== id;
			} ) );

			if ( ! zone.querySelector( '.favorito-item' ) ) {
				zone.querySelectorAll( '.texto-vacio' ).forEach( function( element ) {
					element.style.display = '';
				} );
			}
		} );
	}

	restoreFavorites();
	initFavorites();
}() );
