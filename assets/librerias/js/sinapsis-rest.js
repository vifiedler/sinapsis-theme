( function() {
	'use strict';

	var config = window.sinapsisRestConfig || {};
	var catalogPosts = [];
	var activeFilters = {
		type: 'all',
		difficulty: 'all',
		shelf: 'all',
	};
	var activeSearch = '';
	var searchRequest = 0;

	function textNode( tag, className, text ) {
		var element = document.createElement( tag );

		if ( className ) {
			element.className = className;
		}

		element.textContent = text || '';
		return element;
	}

	function requestJson( url, data ) {
		var query = new URLSearchParams( data || {} );
		var requestUrl = url + ( query.toString() ? ( url.indexOf( '?' ) === -1 ? '?' : '&' ) + query.toString() : '' );

		return window.fetch( requestUrl, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		} ).then( function( response ) {
			var contentType = response.headers.get( 'content-type' ) || '';

			if ( ! response.ok ) {
				throw new Error( 'REST respondió con HTTP ' + response.status + '.' );
			}

			if ( contentType.indexOf( 'application/json' ) === -1 ) {
				throw new Error( 'REST respondió con un contenido que no es JSON.' );
			}

			return response.json();
		} );
	}

	function addTextContent( container, value, className ) {
		if ( ! value ) {
			return;
		}

		String( value ).split( /\n{2,}/ ).forEach( function( paragraph ) {
			container.appendChild( textNode( 'p', className, paragraph.trim() ) );
		} );
	}

	function addInstallationText( container, value ) {
		var installation;

		if ( ! value ) {
			return;
		}

		installation = textNode( 'p', 'library-detail__installation-text', '' );
		installation.textContent = String( value ).trim();
		container.appendChild( installation );
	}

	function shortDescription( value, maxLength ) {
		var description = String( value || '' ).trim();
		var suffix = '...';

		if ( description.length <= maxLength ) {
			return description;
		}

		return description.slice( 0, maxLength - suffix.length ).trimEnd() + suffix;
	}

	function resourceData( post ) {
		var data = post.sinapsis || post.acf || {};
		var terms;

		if ( ! data.shelves && post._embedded && post._embedded['wp:term'] ) {
			data.shelves = post._embedded['wp:term'].reduce( function( result, group ) {
				return result.concat( group.filter( function( term ) {
					return term.taxonomy === 'categoria-libreria';
				} ).map( function( term ) {
					return { name: term.name, slug: term.slug };
				} ) );
			}, [] );
		}

		if ( ! data.resource_type && post._embedded && post._embedded['wp:term'] ) {
			terms = post._embedded['wp:term'].reduce( function( result, group ) {
				return result.concat( group );
			}, [] );
			data.resource_type = terms.some( function( term ) {
				return term.taxonomy === 'category' && term.slug === 'plugin';
			} ) ? 'Plugin' : 'Librería';
		}

		return data;
	}

	function isPlugin( post ) {
		var data = resourceData( post );
		var terms = post._embedded && post._embedded['wp:term'] ? post._embedded['wp:term'].reduce( function( result, group ) {
			return result.concat( group );
		}, [] ) : [];
		var categories = terms.filter( function( term ) {
			return 'category' === term.taxonomy;
		} );

		return 'plugin' === String( data.resource_type || '' ).toLowerCase() ||
			categories.some( function( term ) {
				return [ 'plugin', 'plugins' ].indexOf( String( term.slug || '' ).toLowerCase() ) !== -1 ||
					[ 'plugin', 'plugins' ].indexOf( String( term.name || '' ).toLowerCase() ) !== -1;
			} );
	}

	function libraryTerms( post ) {
		var data = resourceData( post );

		return ( data.shelves || [] ).filter( function( term ) {
			return term && term.slug;
		} );
	}

	function filterValue( value ) {
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

	function matchesFilter( post ) {
		var data = resourceData( post );
		var typeMatches = 'all' === activeFilters.type ||
			( 'plugin' === activeFilters.type && isPlugin( post ) ) ||
			( 'library' === activeFilters.type && ! isPlugin( post ) );
		var difficultyMatches = 'all' === activeFilters.difficulty ||
			filterValue( data.difficulty ) === activeFilters.difficulty;
		var shelfMatches = 'all' === activeFilters.shelf ||
			libraryTerms( post ).some( function( term ) {
				return term.slug === activeFilters.shelf;
			} );

		return typeMatches && difficultyMatches && shelfMatches;
	}

	function updateCounts() {
		var counts = {
			'type-all': catalogPosts.length,
			'type-plugin': catalogPosts.filter( isPlugin ).length,
			'type-library': catalogPosts.filter( function( post ) {
				return ! isPlugin( post );
			} ).length,
			'difficulty-all': catalogPosts.length,
			'difficulty-facil': catalogPosts.filter( function( post ) {
				return filterValue( resourceData( post ).difficulty ) === 'facil';
			} ).length,
			'difficulty-intermedio': catalogPosts.filter( function( post ) {
				return filterValue( resourceData( post ).difficulty ) === 'intermedio';
			} ).length,
			'difficulty-dificil': catalogPosts.filter( function( post ) {
				return filterValue( resourceData( post ).difficulty ) === 'dificil';
			} ).length,
		};
		catalogPosts.forEach( function( post ) {
			libraryTerms( post ).forEach( function( term ) {
				var key = 'shelf-' + term.slug;

				counts[ key ] = ( counts[ key ] || 0 ) + 1;
			} );
		} );
		counts['shelf-all'] = catalogPosts.length;

		Object.keys( counts ).forEach( function( filter ) {
			document.querySelectorAll( '[data-catalog-count="' + filter + '"]' ).forEach( function( count ) {
				count.textContent = String( counts[ filter ] ).padStart( 2, '0' );
			} );
		} );
	}

	function renderTaxonomyFilters() {
		var container = document.querySelector( '[data-library-taxonomy-filters]' );
		var terms = {};

		if ( ! container ) {
			return;
		}

		catalogPosts.forEach( function( post ) {
			libraryTerms( post ).forEach( function( term ) {
				terms[ term.slug ] = term;
			} );
		} );

		Object.keys( terms ).sort( function( first, second ) {
			return terms[ first ].name.localeCompare( terms[ second ].name, 'es', {
				sensitivity: 'base',
			} );
		} ).forEach( function( slug ) {
			var link = document.createElement( 'a' );
			var count = document.createElement( 'span' );

			link.href = '#library-catalog';
			link.dataset.libraryFilterGroup = 'shelf';
			link.dataset.libraryFilter = slug;
			link.textContent = terms[ slug ].name;
			count.dataset.catalogCount = 'shelf-' + slug;
			count.textContent = '--';
			link.appendChild( count );
			container.appendChild( link );
		} );
	}

	function imageUrl( image ) {
		if ( ! image ) {
			return '';
		}

		if ( typeof image === 'string' ) {
			return image;
		}

		return image.url || ( image.sizes && ( image.sizes.large || image.sizes.medium ) ) || '';
	}

	function shelfName( post ) {
		var shelves = resourceData( post ).shelves || [];
		return shelves.length && shelves[ 0 ].name ? shelves[ 0 ].name : 'Sin clasificar';
	}

	function createShelf( name ) {
		var shelf = document.createElement( 'section' );
		var grid = document.createElement( 'div' );

		shelf.className = 'library-shelf';
		shelf.dataset.shelf = name;
		shelf.appendChild( textNode( 'h2', 'library-shelf__title', name ) );
		grid.className = 'library-catalog__grid row g-3';
		shelf.appendChild( grid );
		return shelf;
	}

	function addDetailSections( container, post, data ) {
		var content = document.createElement( 'div' );

		content.className = 'library-detail__content';

		if ( imageUrl( data.image ) ) {
			var image = document.createElement( 'img' );

			image.className = 'library-detail__image rounded border';
			image.src = imageUrl( data.image );
			image.alt = post.title.rendered;
			image.loading = 'lazy';
			content.appendChild( image );
		}

		if ( data.installation ) {
			content.appendChild( textNode( 'h3', 'mt-3', data.installation_title || 'Instalación' ) );
			addInstallationText( content, data.installation );
		}

		if ( data.example_code ) {
			var codeBox = textNode( 'div', 'library-detail__code', '' );
			var pre = document.createElement( 'pre' );

			codeBox.appendChild( textNode( 'span', '', 'CÓDIGO DE EJEMPLO' ) );
			pre.className = 'mb-0';
			pre.appendChild( textNode( 'code', '', data.example_code ) );
			codeBox.appendChild( pre );
			content.appendChild( codeBox );
		}

		if ( data.link ) {
			var linkBox = textNode( 'div', 'library-detail__actions', '' );
			var link = document.createElement( 'a' );

			link.className = 'btn btn-outline-light btn-sm';
			link.href = data.link;
			link.rel = 'external noopener';
			link.target = '_blank';
			link.textContent = 'Visitar recurso';
			linkBox.appendChild( link );
			content.appendChild( linkBox );
		}

		container.appendChild( content );
	}

	function createCard( post ) {
		var data = resourceData( post );
		var id = String( post.id );
		var details = document.createElement( 'details' );
		var summary = document.createElement( 'summary' );
		var meta = document.createElement( 'div' );
		var footer = document.createElement( 'div' );
		var detail = document.createElement( 'div' );
		var level = textNode( 'div', 'library-card__level', '' );

		details.id = 'post-' + id;
		details.className = 'library-item col-12 col-md-6 col-xl-4';
		details.draggable = true;
		details.dataset.id = id;
		details.dataset.nombre = post.title.rendered;
		summary.className = 'library-card d-flex flex-column';
		meta.className = 'library-card__meta d-flex justify-content-between align-items-center';
		meta.appendChild( textNode( 'span', 'module-id', 'MOD-' + id.padStart( 3, '0' ) ) );
		meta.appendChild( textNode( 'span', 'library-type', data.resource_type || 'Librería' ) );
		summary.appendChild( meta );
		summary.appendChild( textNode( 'h2', 'mt-4', post.title.rendered ) );
		level.appendChild( textNode( 'span', '', 'NIVEL:' ) );
		level.appendChild( document.createTextNode( ' ' + ( data.difficulty || 'No especificada' ) ) );
		summary.appendChild( level );
		summary.appendChild( textNode( 'p', '', shortDescription( data.description || 'Sin descripción disponible.', 50 ) ) );
		footer.className = 'library-card__footer d-flex justify-content-between align-items-center mt-auto';
		footer.appendChild( textNode( 'span', '', data.resource_type || 'Librería' ) );
		footer.appendChild( textNode( 'span', 'show-label', 'Mostrar →' ) );
		summary.appendChild( footer );
		detail.className = 'library-detail';
		detail.appendChild( textNode( 'div', 'library-detail__intro', '' ) );
		detail.firstChild.appendChild( textNode( 'span', 'eyebrow', 'INSPECTOR / ' + id ) );
		detail.firstChild.appendChild( textNode( 'h2', '', post.title.rendered ) );
		addTextContent( detail.firstChild, data.description );
		addDetailSections( detail, post, data );
		details.appendChild( summary );
		details.appendChild( detail );
		return details;
	}

	function showCatalogError( container ) {
		container.replaceChildren( textNode( 'p', 'catalog-status', 'No fue posible cargar los módulos desde la API REST.' ) );
	}

	function renderCatalog( posts ) {
		var container = document.getElementById( 'library-catalog' );
		var visiblePosts = posts.filter( matchesFilter );
		var shelves = {};
		var catalogCount = document.getElementById( 'catalog-count' );

		if ( ! container ) {
			return;
		}

		container.replaceChildren();
		if ( catalogCount ) {
			catalogCount.textContent = String( visiblePosts.length ).padStart( 2, '0' );
		}

		if ( ! visiblePosts.length ) {
			container.appendChild( textNode( 'p', 'catalog-status', activeSearch ? 'No se encontraron módulos.' : 'No hay módulos en esta categoría.' ) );
			return;
		}

		visiblePosts.forEach( function( post ) {
			var name = shelfName( post );

			if ( ! shelves[ name ] ) {
				shelves[ name ] = createShelf( name );
				container.appendChild( shelves[ name ] );
			}
			shelves[ name ].querySelector( '.library-catalog__grid' ).appendChild( createCard( post ) );
		} );
	}

	function initFilters() {
		document.querySelectorAll( '[data-library-filter][data-library-filter-group]' ).forEach( function( filter ) {
			if ( filter.dataset.ready ) {
				return;
			}

			filter.dataset.ready = 'true';
			filter.addEventListener( 'click', function( event ) {
				var group = filter.dataset.libraryFilterGroup;

				event.preventDefault();
				activeFilters[ group ] = filter.dataset.libraryFilter;
				document.querySelectorAll( '[data-library-filter-group="' + group + '"]' ).forEach( function( item ) {
					item.classList.toggle( 'is-active', item === filter );
				} );
				renderCatalog( catalogPosts );
			} );
		} );
	}

	function initSearch( endpoint, perPage ) {
		var form = document.querySelector( '[data-library-search-form]' );
		var input = document.querySelector( '[data-library-search-input]' );
		var timer;

		if ( ! form || ! input || form.dataset.ready ) {
			return;
		}

		form.dataset.ready = 'true';
		form.addEventListener( 'submit', function( event ) {
			event.preventDefault();
		} );
		input.addEventListener( 'input', function() {
			var value = input.value.trim();
			var requestId = ++searchRequest;

			window.clearTimeout( timer );
			timer = window.setTimeout( function() {
				if ( ! value ) {
					activeSearch = '';
					renderCatalog( catalogPosts );
					return;
				}

				requestJson( endpoint, {
					search: value,
					per_page: perPage,
					_embed: true,
				} ).then( function( posts ) {
					if ( requestId !== searchRequest ) {
						return;
					}
					activeSearch = value;
					renderCatalog( Array.isArray( posts ) ? posts : [] );
				} ).catch( function( error ) {
					if ( requestId !== searchRequest ) {
						return;
					}
					console.error( 'Error buscando módulos en REST:', error );
					showCatalogError( document.getElementById( 'library-catalog' ) );
				} );
			}, 300 );
		} );
	}

	function loadCatalog() {
		var container = document.getElementById( 'library-catalog' );
		var endpoint = container && container.dataset.restEndpoint ? container.dataset.restEndpoint : config.postsUrl;
		var perPage = container && container.dataset.perPage ? container.dataset.perPage : '100';

		if ( ! container || ! endpoint ) {
			return;
		}

		requestJson( endpoint, {
			per_page: perPage,
			_embed: true,
		} )
			.then( function( posts ) {
				catalogPosts = Array.isArray( posts ) ? posts : [];
				renderTaxonomyFilters();
				initFilters();
				updateCounts();
				renderCatalog( catalogPosts );
				initSearch( endpoint, perPage );
			} )
			.catch( function( error ) {
				console.error( 'Error cargando el catálogo REST:', error );
				showCatalogError( container );
			} );
	}

	function loadSingleEntry() {
		var article = document.querySelector( '[data-rest-post-id]' );

		if ( ! article || ! config.postsUrl ) {
			return;
		}

		requestJson( config.postsUrl + '/' + encodeURIComponent( article.dataset.restPostId ), {
			_embed: true,
		} )
			.then( function( post ) {
				var data = resourceData( post );
				var content = article.querySelector( '.library-entry__content' );

				content.replaceChildren();
				addTextContent( content, data.description, 'library-entry__description mb-4' );
				addDetailSections( content, post, data );
			} )
			.catch( function( error ) {
				console.error( 'Error cargando el detalle REST:', error );
				var content = article.querySelector( '.library-entry__content' );

				if ( content ) {
					content.textContent = 'No fue posible cargar el detalle desde la API REST.';
				}
			} );
	}

	initFilters();
	loadCatalog();
	loadSingleEntry();

	window.SinapsisRestClient = {
		requestJson: requestJson,
	};
}() );
