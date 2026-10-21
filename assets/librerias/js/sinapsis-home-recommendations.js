( function( $ ) {
	'use strict';

	var storageKey = 'sinapsis_favoritos';
	var engine = window.SinapsisRecommendationEngine;
	var maxRecommendations = 6;
	var loadSequence = 0;

	function card( post ) {
		var data = engine.resourceData( post );
		var title = post.title && post.title.rendered ? post.title.rendered : 'Sin título';
		var description = String( data.description || 'Sin descripción disponible.' ).trim();
		var item = document.createElement( 'article' );
		var link = document.createElement( 'a' );

		item.className = 'home-recommendations__slide';
		link.className = 'home-recommendations__card';
		link.href = post.link || '#';
		link.innerHTML = '<span class="eyebrow">RECOMMENDED</span><h3></h3><p></p><span class="home-recommendations__meta"></span>';
		link.querySelector( 'h3' ).textContent = title;
		link.querySelector( 'p' ).textContent = description;
		link.querySelector( '.home-recommendations__meta' ).textContent = ( data.resource_type || 'Librería' ) + ' · ' + ( data.difficulty || 'Nivel no especificado' );
		item.appendChild( link );
		return item;
	}

	function ensureJqueryType() {
		if ( typeof $.type === 'function' ) {
			return;
		}

		$.type = function( value ) {
			if ( value === null ) {
				return 'null';
			}
			if ( Array.isArray( value ) ) {
				return 'array';
			}
			return typeof value;
		};
	}

	function render( posts, carousel ) {
		if ( carousel.hasClass( 'slick-initialized' ) ) {
			carousel.slick( 'unslick' );
		}
		carousel.empty();
		posts.forEach( function( post ) {
			carousel.append( card( post ) );
		} );
		if ( posts.length ) {
			ensureJqueryType();
			carousel.slick( {
				autoplay: true,
				autoplaySpeed: 0,
				cssEase: 'linear',
				dots: true,
				infinite: posts.length > 1,
				pauseOnFocus: false,
				pauseOnHover: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				speed: 9000,
				waitForAnimate: false,
				responsive: [
					{ breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
					{ breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
				],
			} );
		}
	}

	function load() {
		var section = document.querySelector( '.home-recommendations' );
		var carousel = $( '.home-recommendations__carousel' );
		var endpoint;
		var currentSequence = ++loadSequence;

		if ( ! section || ! carousel.length ) {
			return;
		}
		endpoint = section.dataset.recommendationsEndpoint;
		window.SinapsisRestClient.requestJson( endpoint, { per_page: 100, _embed: true } ).then( function( posts ) {
			var favorites = engine.readFavorites( storageKey );
			var favoriteIds = {};
			var available = ( Array.isArray( posts ) ? posts : [] );

			favorites.forEach( function( favorite ) {
				favoriteIds[ String( favorite.id ) ] = true;
			} );
			available = available.filter( function( post ) {
				return ! favoriteIds[ String( post.id ) ];
			} );

			if ( currentSequence !== loadSequence ) {
				return;
			}

			if ( section.dataset.userLoggedIn !== 'true' || ! favorites.length ) {
				render( engine.randomPosts( available, maxRecommendations ), carousel );
				return;
			}

			window.SinapsisRestClient.requestJson( endpoint, { include: Object.keys( favoriteIds ).join( ',' ), per_page: favorites.length, _embed: true } )
				.then( function( favoritePosts ) {
					var recommendations = engine.personalizedPosts(
						available,
						Array.isArray( favoritePosts ) ? favoritePosts : [],
						maxRecommendations
					);

					if ( currentSequence !== loadSequence ) {
						return;
					}

					render( recommendations.length ? recommendations : engine.randomPosts( available, maxRecommendations ), carousel );
				} )
				.catch( function( error ) {
					console.error( 'Error cargando favoritos para recomendaciones:', error );
					if ( currentSequence !== loadSequence ) {
						return;
					}

					render( engine.randomPosts( available, maxRecommendations ), carousel );
				} );
		} ).catch( function( error ) {
			console.error( 'Error cargando recomendaciones:', error );
			if ( currentSequence !== loadSequence ) {
				return;
			}

			carousel.html( '<p class="catalog-status">No fue posible cargar las recomendaciones.</p>' );
		} );
	}

	$( function() {
		load();
		window.addEventListener( 'sinapsis:favorites-changed', load );
	} );
}( window.jQuery ) );
