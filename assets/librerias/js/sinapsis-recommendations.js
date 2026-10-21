( function( window ) {
	'use strict';

	var storageKey = 'sinapsis_favoritos';
	var maxRecommendations = 6;
	var engine = window.SinapsisRecommendationEngine;

	function requestJson( url, data ) {
		return window.jQuery.ajax( {
			url: url,
			method: 'GET',
			data: data || {},
			dataType: 'json',
		} );
	}

	function renderMessage( container, message ) {
		var paragraph;

		if ( ! container ) {
			return;
		}

		container.replaceChildren();
		paragraph = document.createElement( 'p' );
		paragraph.className = 'user-page__intro col-12 mt-2 mb-3';
		paragraph.textContent = message;
		container.appendChild( paragraph );
	}

	function buildPostItem( post ) {
		var data = engine.resourceData( post );
		var item = document.createElement( 'div' );
		var title = document.createElement( 'strong' );
		var meta = document.createElement( 'span' );
		var link = document.createElement( 'a' );

		item.className = 'user-page__item col-12 col-md-6';
		title.textContent = post.title && post.title.rendered ? post.title.rendered : 'Sin título';
		meta.textContent = ( data.resource_type || 'Librería' ) + ' · ' + ( data.difficulty || 'Nivel no especificado' );
		item.appendChild( title );
		item.appendChild( meta );

		if ( post.link ) {
			link.className = 'user-page__item-link';
			link.href = post.link;
			link.textContent = 'Ver detalle →';
			item.appendChild( link );
		}
		return item;
	}

	function renderPosts( container, posts ) {
		if ( ! container ) {
			return;
		}

		container.replaceChildren();
		posts.forEach( function( post ) {
			container.appendChild( buildPostItem( post ) );
		} );
	}

	function loadAll() {
		var favoritesContainer = document.getElementById( 'favorites-list' );
		var recommendationsContainer = document.getElementById( 'recommendations-list' );
		var favorites;
		var endpoint;
		var favoriteIds;

		if ( ! favoritesContainer && ! recommendationsContainer ) {
			return;
		}

		favorites = engine.readFavorites( storageKey );
		endpoint = ( favoritesContainer && favoritesContainer.dataset.favoritesEndpoint ) ||
			( recommendationsContainer && recommendationsContainer.dataset.recommendationsEndpoint ) || '';

		if ( ! favorites.length ) {
			renderMessage( favoritesContainer, 'Aún no tienes favoritos. Arrastra módulos desde el catálogo.' );
			renderMessage( recommendationsContainer, 'Añade módulos a favoritos arrastrándolos a la zona de favoritos para generar recomendaciones.' );
			return;
		}

		favoriteIds = favorites.map( function( favorite ) {
			return parseInt( favorite.id, 10 );
		} ).filter( function( id ) {
			return ! isNaN( id );
		} );

		if ( ! favoriteIds.length || ! endpoint ) {
			renderMessage( favoritesContainer, 'No fue posible cargar tus favoritos.' );
			return;
		}

		requestJson( endpoint, {
			include: favoriteIds.join( ',' ),
			per_page: favoriteIds.length,
			_embed: true,
		} ).done( function( favoritePosts ) {
			if ( ! Array.isArray( favoritePosts ) || ! favoritePosts.length ) {
				renderMessage( favoritesContainer, 'Los favoritos guardados ya no existen en el catálogo.' );
				renderMessage( recommendationsContainer, 'No se encontraron datos para tus favoritos.' );
				return;
			}

			renderPosts( favoritesContainer, favoritePosts );
			if ( ! recommendationsContainer ) {
				return;
			}

			requestJson( endpoint, { per_page: 100, _embed: true } ).done( function( allPosts ) {
				var recommendations = engine.personalizedPosts(
					Array.isArray( allPosts ) ? allPosts : [],
					favoritePosts,
					maxRecommendations
				);

				if ( ! recommendations.length ) {
					renderMessage( recommendationsContainer, 'Aún no hay módulos relacionados.' );
					return;
				}
				renderPosts( recommendationsContainer, recommendations );
			} );
		} ).fail( function() {
			renderMessage( favoritesContainer, 'Error al cargar favoritos.' );
			renderMessage( recommendationsContainer, 'Error al cargar recomendaciones.' );
		} );
	}

	document.addEventListener( 'DOMContentLoaded', loadAll );
	window.addEventListener( 'storage', function( event ) {
		if ( event.key === storageKey ) {
			loadAll();
		}
	} );
	window.addEventListener( 'pageshow', function( event ) {
		if ( event.persisted ) {
			loadAll();
		}
	} );
}( window ) );
