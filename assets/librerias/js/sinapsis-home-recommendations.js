( function( $ ) {
	'use strict';

	var storageKey = 'sinapsis_favoritos';
	var endpoint;
	var maxRecommendations = 6;

	function readFavorites() {
		try {
			return JSON.parse( localStorage.getItem( storageKey ) || '[]' );
		} catch ( error ) {
			console.error( 'No fue posible leer los favoritos:', error );
			return [];
		}
	}

	function dataFor( post ) {
		return post.sinapsis || post.acf || {};
	}

	function normalize( value ) {
		return String( value || '' ).toLowerCase()
			.replace( /[áàäâ]/g, 'a' )
			.replace( /[éèëê]/g, 'e' )
			.replace( /[íìïî]/g, 'i' )
			.replace( /[óòöô]/g, 'o' )
			.replace( /[úùüû]/g, 'u' )
			.replace( /ñ/g, 'n' )
			.trim();
	}

	function termIds( post, taxonomy ) {
		var ids = [];

		( post._embedded && post._embedded['wp:term'] || [] ).forEach( function( group ) {
			group.forEach( function( term ) {
				if ( term.taxonomy === taxonomy ) {
					ids.push( term.id );
				}
			} );
		} );
		return ids;
	}

	function profileFor( posts ) {
		var profile = { categories: {}, difficulties: {}, types: {} };

		posts.forEach( function( post ) {
			var data = dataFor( post );

			termIds( post, 'categoria-libreria' ).concat( termIds( post, 'category' ) ).forEach( function( id ) {
				profile.categories[ id ] = ( profile.categories[ id ] || 0 ) + 1;
			} );
			if ( data.difficulty ) {
				profile.difficulties[ normalize( data.difficulty ) ] = ( profile.difficulties[ normalize( data.difficulty ) ] || 0 ) + 1;
			}
			if ( data.resource_type ) {
				profile.types[ normalize( data.resource_type ) ] = ( profile.types[ normalize( data.resource_type ) ] || 0 ) + 1;
			}
		} );
		return profile;
	}

	function score( post, profile ) {
		var data = dataFor( post );
		var value = 0;

		termIds( post, 'categoria-libreria' ).forEach( function( id ) {
			value += ( profile.categories[ id ] || 0 ) * 3;
		} );
		termIds( post, 'category' ).forEach( function( id ) {
			value += ( profile.categories[ id ] || 0 ) * 2;
		} );
		value += ( profile.difficulties[ normalize( data.difficulty ) ] || 0 ) * 2;
		value += ( profile.types[ normalize( data.resource_type ) ] || 0 );
		return value;
	}

	function randomPosts( posts ) {
		return posts.sort( function() {
			return Math.random() - 0.5;
		} ).slice( 0, 3 );
	}

	function card( post ) {
		var data = dataFor( post );
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
			var favorites = readFavorites();
			var favoriteIds = {};
			var available = ( Array.isArray( posts ) ? posts : [] );

			favorites.forEach( function( favorite ) {
				favoriteIds[ String( favorite.id ) ] = true;
			} );
			available = available.filter( function( post ) {
				return ! favoriteIds[ String( post.id ) ];
			} );

			if ( section.dataset.userLoggedIn !== 'true' || ! favorites.length ) {
				render( randomPosts( available ), carousel );
				return;
			}

			$.getJSON( endpoint, { include: Object.keys( favoriteIds ).join( ',' ), per_page: favorites.length, _embed: true } )
				.done( function( favoritePosts ) {
					var profile = profileFor( Array.isArray( favoritePosts ) ? favoritePosts : [] );
					var recommendations = available.map( function( post ) {
						return { post: post, score: score( post, profile ) };
					} ).filter( function( entry ) {
						return entry.score > 0;
					} ).sort( function( a, b ) {
						return b.score - a.score;
					} ).slice( 0, maxRecommendations ).map( function( entry ) {
						return entry.post;
					} );

					render( recommendations.length ? recommendations : randomPosts( available ), carousel );
				} );
		} ).fail( function() {
			carousel.html( '<p class="catalog-status">No fue posible cargar las recomendaciones.</p>' );
		} );
	}

	$( load );
}( window.jQuery ) );
