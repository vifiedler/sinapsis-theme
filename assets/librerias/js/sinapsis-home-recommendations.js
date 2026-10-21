( function( $ ) {
	'use strict';

	var storageKey = 'sinapsis_favoritos';
	var engine = window.SinapsisRecommendationEngine;
	var maxRecommendations = 6;

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

	function render( posts, carousel ) {
		carousel.empty();
		posts.forEach( function( post ) {
			carousel.append( card( post ) );
		} );
		if ( posts.length ) {
			carousel.slick( {
				autoplay: true,
				autoplaySpeed: 3500,
				dots: true,
				infinite: posts.length > 3,
				slidesToShow: 3,
				slidesToScroll: 1,
				speed: 500,
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

		if ( ! section || ! carousel.length ) {
			return;
		}
		endpoint = section.dataset.recommendationsEndpoint;
		$.getJSON( endpoint, { per_page: 100, _embed: true } ).done( function( posts ) {
			var favorites = engine.readFavorites( storageKey );
			var favoriteIds = {};
			var available = ( Array.isArray( posts ) ? posts : [] );

			favorites.forEach( function( favorite ) {
				favoriteIds[ String( favorite.id ) ] = true;
			} );
			available = available.filter( function( post ) {
				return ! favoriteIds[ String( post.id ) ];
			} );

			if ( section.dataset.userLoggedIn !== 'true' || ! favorites.length ) {
				render( engine.randomPosts( available, maxRecommendations ), carousel );
				return;
			}

			$.getJSON( endpoint, { include: Object.keys( favoriteIds ).join( ',' ), per_page: favorites.length, _embed: true } )
				.done( function( favoritePosts ) {
					var recommendations = engine.personalizedPosts(
						available,
						Array.isArray( favoritePosts ) ? favoritePosts : [],
						maxRecommendations
					);

					render( recommendations.length ? recommendations : engine.randomPosts( available, maxRecommendations ), carousel );
				} );
		} ).fail( function() {
			carousel.html( '<p class="catalog-status">No fue posible cargar las recomendaciones.</p>' );
		} );
	}

	$( load );
}( window.jQuery ) );
