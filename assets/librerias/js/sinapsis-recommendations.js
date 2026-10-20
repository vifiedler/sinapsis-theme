( function() {
	'use strict';

	var storageKey = 'sinapsis_favoritos';
	var MAX_RECOMMENDATIONS = 6;

	function readFavorites() {
		try {
			return JSON.parse( localStorage.getItem( storageKey ) || '[]' );
		} catch ( error ) {
			console.error( 'No fue posible leer los favoritos:', error );
			return [];
		}
	}

	function requestJson( url, data ) {
		return window.jQuery.ajax( {
			url: url,
			method: 'GET',
			data: data || {},
			dataType: 'json',
		} );
	}

	function resourceData( post ) {
		return post.sinapsis || post.acf || {};
	}

	function normalize( value ) {
		return String( value || '' )
			.toLowerCase()
			.replace( /[áàäâ]/g, 'a' )
			.replace( /[éèëê]/g, 'e' )
			.replace( /[íìïî]/g, 'i' )
			.replace( /[óòöô]/g, 'o' )
			.replace( /[úùüû]/g, 'u' )
			.replace( /ñ/g, 'n' )
			.trim();
	}

	function extractTermIds( post, taxonomy ) {
		var ids = [];
		if ( ! post._embedded || ! post._embedded[ 'wp:term' ] ) {
			return ids;
		}
		post._embedded[ 'wp:term' ].forEach( function( group ) {
			group.forEach( function( term ) {
				if ( term.taxonomy === taxonomy ) {
					ids.push( term.id );
				}
			} );
		} );
		return ids;
	}

	function buildProfile( favoritePosts ) {
		var profile = { categories: {}, difficulties: {}, types: {} };

		favoritePosts.forEach( function( post ) {
			var data = resourceData( post );

			extractTermIds( post, 'categoria-libreria' ).forEach( function( id ) {
				profile.categories[ id ] = ( profile.categories[ id ] || 0 ) + 1;
			} );
			extractTermIds( post, 'category' ).forEach( function( id ) {
				profile.categories[ id ] = ( profile.categories[ id ] || 0 ) + 1;
			} );

			if ( data.difficulty ) {
				var diff = normalize( data.difficulty );
				profile.difficulties[ diff ] = ( profile.difficulties[ diff ] || 0 ) + 1;
			}

			if ( data.resource_type ) {
				var type = normalize( data.resource_type );
				profile.types[ type ] = ( profile.types[ type ] || 0 ) + 1;
			}
		} );
		return profile;
	}

	function scorePost( post, profile ) {
		var data = resourceData( post );
		var score = 0;

		extractTermIds( post, 'categoria-libreria' ).forEach( function( id ) {
			score += ( profile.categories[ id ] || 0 ) * 3;
		} );
		extractTermIds( post, 'category' ).forEach( function( id ) {
			score += ( profile.categories[ id ] || 0 ) * 2;
		} );
		if ( data.difficulty ) {
			score += ( profile.difficulties[ normalize( data.difficulty ) ] || 0 ) * 2;
		}
		if ( data.resource_type ) {
			score += ( profile.types[ normalize( data.resource_type ) ] || 0 ) * 1;
		}
		return score;
	}

	function renderMessage( container, message ) {
		if ( ! container ) return;
		container.replaceChildren();
		var p = document.createElement( 'p' );
		p.className = 'user-page__intro';
		p.textContent = message;
		container.appendChild( p );
	}

	function buildPostItem( post ) {
		var data = resourceData( post );
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
		if ( ! container ) return;
		container.replaceChildren();
		posts.forEach( function( post ) {
			container.appendChild( buildPostItem( post ) );
		} );
	}

	function loadAll() {
		var favoritesContainer = document.getElementById( 'favorites-list' );
		var recommendationsContainer = document.getElementById( 'recommendations-list' );

		if ( ! favoritesContainer && ! recommendationsContainer ) return;

		var favorites = readFavorites();
		var endpoint = ( favoritesContainer && favoritesContainer.dataset.favoritesEndpoint ) ||
			( recommendationsContainer && recommendationsContainer.dataset.recommendationsEndpoint ) || '';

		if ( ! favorites.length ) {
			renderMessage( favoritesContainer, 'Aún no tienes favoritos. Arrastra módulos desde el catálogo.' );
			renderMessage( recommendationsContainer, 'Añade módulos a favoritos arrastrándolos a la zona de favoritos para generar recomendaciones.' );
			return;
		}

		var favoriteIds = favorites
			.map( function( favorite ) { return parseInt( favorite.id, 10 ); } )
			.filter( function( id ) { return ! isNaN( id ); } );

		if ( ! favoriteIds.length || ! endpoint ) {
			renderMessage( favoritesContainer, 'No fue posible cargar tus favoritos.' );
			return;
		}

		requestJson( endpoint, {
			include: favoriteIds.join( ',' ),
			per_page: favoriteIds.length,
			_embed: true,
		} )
			.done( function( favoritePosts ) {
				if ( ! Array.isArray( favoritePosts ) || ! favoritePosts.length ) {
					renderMessage( favoritesContainer, 'Los favoritos guardados ya no existen en el catálogo.' );
					renderMessage( recommendationsContainer, 'No se encontraron datos para tus favoritos.' );
					return;
				}

				// favoritos
				renderPosts( favoritesContainer, favoritePosts );

				if ( ! recommendationsContainer ) return;

				requestJson( endpoint, { per_page: 100, _embed: true } )
					.done( function( allPosts ) {
						var profile = buildProfile( favoritePosts );
						var favoriteSet = {};
						favoritePosts.forEach( function( post ) { favoriteSet[ String( post.id ) ] = true; } );

						var recommendations = ( Array.isArray( allPosts ) ? allPosts : [] )
							.filter( function( post ) { return ! favoriteSet[ String( post.id ) ]; } )
							.map( function( post ) { return { post: post, score: scorePost( post, profile ) }; } )
							.filter( function( entry ) { return entry.score > 0; } )
							.sort( function( a, b ) { return b.score - a.score; } )
							.slice( 0, MAX_RECOMMENDATIONS )
							.map( function( entry ) { return entry.post; } );

						if ( ! recommendations.length ) {
							renderMessage( recommendationsContainer, 'Aún no hay módulos relacionados.' );
							return;
						}
						// recomendaciones
						renderPosts( recommendationsContainer, recommendations );
					} );
			} )
			.fail( function () {
				renderMessage( favoritesContainer, 'Error al cargar favoritos.' );
				renderMessage( recommendationsContainer, 'Error al cargar recomendaciones.' );
			} );
	}

	document.addEventListener( 'DOMContentLoaded', loadAll );
	window.addEventListener( 'storage', function( event ) {
		if ( event.key === storageKey ) loadAll();
	} );
	window.addEventListener( 'pageshow', function( event ) {
		if ( event.persisted ) loadAll();
	} );
}() );