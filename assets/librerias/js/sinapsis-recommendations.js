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
		var profile = {
			categories: {},
			difficulties: {},
			types: {},
		};

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
		container.replaceChildren();
		var p = document.createElement( 'p' );
		p.className = 'user-page__intro';
		p.textContent = message;
		container.appendChild( p );
	}

	function renderRecommendations( container, posts ) {
		container.replaceChildren();

		posts.forEach( function( post ) {
			var data = resourceData( post );
			var item = document.createElement( 'div' );
			var title = document.createElement( 'strong' );
			var meta = document.createElement( 'span' );
			var link = document.createElement( 'a' );

			item.className = 'user-page__item col-12 col-md-6';
			title.textContent = post.title && post.title.rendered
				? post.title.rendered
				: 'Sin título';
			meta.textContent = ( data.resource_type || 'Librería' ) +
				' · ' + ( data.difficulty || 'Nivel no especificado' );

			item.appendChild( title );
			item.appendChild( meta );

			if ( post.link ) {
				link.className = 'user-page__item-link';
				link.href = post.link;
				link.textContent = 'Ver detalle →';
				item.appendChild( link );
			}

			container.appendChild( item );
		} );
	}

	function loadRecommendations() {
		var container = document.getElementById( 'recommendations-list' );

		if ( ! container ) {
			return;
		}

		var favorites = readFavorites();
		var endpoint = container.dataset.recommendationsEndpoint || '';

		if ( ! favorites.length ) {
			renderMessage(
				container,
				'Añade módulos a favoritos arrastrándolos a la zona de favoritos para generar recomendaciones.'
			);
			return;
		}

		var favoriteIds = favorites
			.map( function( favorite ) {
				return parseInt( favorite.id, 10 );
			} )
			.filter( function( id ) {
				return ! isNaN( id );
			} );

		if ( ! favoriteIds.length || ! endpoint ) {
			renderMessage( container, 'No fue posible generar recomendaciones en este momento.' );
			return;
		}

		requestJson( endpoint, {
			include: favoriteIds.join( ',' ),
			per_page: favoriteIds.length,
			_embed: true,
		} )
			.done( function( favoritePosts ) {
				if ( ! Array.isArray( favoritePosts ) || ! favoritePosts.length ) {
					renderMessage( container, 'No se encontraron datos para tus favoritos.' );
					return;
				}

				requestJson( endpoint, {
					per_page: 100,
					_embed: true,
				} )
					.done( function( allPosts ) {
						var profile = buildProfile( favoritePosts );
						var favoriteSet = {};

						favoritePosts.forEach( function( post ) {
							favoriteSet[ String( post.id ) ] = true;
						} );

						var recommendations = ( Array.isArray( allPosts ) ? allPosts : [] )
							.filter( function( post ) {
								return ! favoriteSet[ String( post.id ) ];
							} )
							.map( function( post ) {
								return {
									post: post,
									score: scorePost( post, profile ),
								};
							} )
							.filter( function( entry ) {
								return entry.score > 0;
							} )
							.sort( function( a, b ) {
								return b.score - a.score;
							} )
							.slice( 0, MAX_RECOMMENDATIONS )
							.map( function( entry ) {
								return entry.post;
							} );

						if ( ! recommendations.length ) {
							renderMessage(
								container,
								'Aún no hay módulos relacionados. Prueba guardando más favoritos.'
							);
							return;
						}

						renderRecommendations( container, recommendations );
					} )
					.fail( function( xhr, status, error ) {
						console.error( 'Error cargando recomendaciones:', status, error, xhr.status );
						renderMessage( container, 'No fue posible cargar las recomendaciones.' );
					} );
			} )
			.fail( function( xhr, status, error ) {
				console.error( 'Error cargando favoritos:', status, error, xhr.status );
				renderMessage( container, 'No fue posible cargar tus favoritos.' );
			} );
	}

	document.addEventListener( 'DOMContentLoaded', loadRecommendations );

	
	window.addEventListener( 'storage', function( event ) {
		if ( event.key === storageKey ) {
			loadRecommendations();
		}
	} );
}() );