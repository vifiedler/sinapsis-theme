( function( window ) {
	'use strict';

	function readFavorites( storageKey ) {
		try {
			return JSON.parse( window.localStorage.getItem( storageKey ) || '[]' );
		} catch ( error ) {
			console.error( 'No fue posible leer los favoritos:', error );
			return [];
		}
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

		if ( ! post._embedded || ! post._embedded['wp:term'] ) {
			return ids;
		}

		post._embedded['wp:term'].forEach( function( group ) {
			group.forEach( function( term ) {
				if ( term.taxonomy === taxonomy ) {
					ids.push( term.id );
				}
			} );
		} );
		return ids;
	}

	function buildProfile( posts ) {
		var profile = { categories: {}, difficulties: {}, types: {} };

		posts.forEach( function( post ) {
			var data = resourceData( post );

			extractTermIds( post, 'categoria-libreria' ).forEach( function( id ) {
				profile.categories[ id ] = ( profile.categories[ id ] || 0 ) + 1;
			} );
			extractTermIds( post, 'category' ).forEach( function( id ) {
				profile.categories[ id ] = ( profile.categories[ id ] || 0 ) + 1;
			} );
			if ( data.difficulty ) {
				profile.difficulties[ normalize( data.difficulty ) ] =
					( profile.difficulties[ normalize( data.difficulty ) ] || 0 ) + 1;
			}
			if ( data.resource_type ) {
				profile.types[ normalize( data.resource_type ) ] =
					( profile.types[ normalize( data.resource_type ) ] || 0 ) + 1;
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
		score += ( profile.difficulties[ normalize( data.difficulty ) ] || 0 ) * 2;
		score += profile.types[ normalize( data.resource_type ) ] || 0;
		return score;
	}

	function randomPosts( posts, amount ) {
		return posts.slice().sort( function() {
			return Math.random() - 0.5;
		} ).slice( 0, amount );
	}

	function personalizedPosts( posts, favoritePosts, amount ) {
		var favoriteIds = {};
		var profile = buildProfile( favoritePosts );

		favoritePosts.forEach( function( post ) {
			favoriteIds[ String( post.id ) ] = true;
		} );

		return posts.filter( function( post ) {
			return ! favoriteIds[ String( post.id ) ];
		} ).map( function( post ) {
			return { post: post, score: scorePost( post, profile ) };
		} ).filter( function( entry ) {
			return entry.score > 0;
		} ).sort( function( first, second ) {
			return second.score - first.score;
		} ).slice( 0, amount ).map( function( entry ) {
			return entry.post;
		} );
	}

	window.SinapsisRecommendationEngine = {
		buildProfile: buildProfile,
		personalizedPosts: personalizedPosts,
		randomPosts: randomPosts,
		readFavorites: readFavorites,
		resourceData: resourceData,
	};
}( window ) );
