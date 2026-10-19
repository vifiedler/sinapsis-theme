( function() {
	'use strict';

	var config = window.sinapsisRestConfig || {};
	var catalogPosts = [];
	var activeFilter = 'all';
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
		return window.jQuery.ajax( {
			url: url,
			method: 'GET',
			data: data || {},
			dataType: 'json',
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

	function matchesFilter( post ) {
		return 'all' === activeFilter ||
			( 'plugin' === activeFilter && isPlugin( post ) ) ||
			( 'library' === activeFilter && ! isPlugin( post ) );
	}

	function updateCounts() {
		var counts = {
			all: catalogPosts.length,
			plugin: catalogPosts.filter( isPlugin ).length,
			library: catalogPosts.filter( function( post ) {
				return ! isPlugin( post );
			} ).length,
		};

		Object.keys( counts ).forEach( function( filter ) {
			document.querySelectorAll( '[data-catalog-count="' + filter + '"]' ).forEach( function( count ) {
				count.textContent = String( counts[ filter ] ).padStart( 2, '0' );
			} );
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
		var installationRow = document.createElement( 'div' );
		var content = document.createElement( 'div' );

		installationRow.className = 'library-detail__installation row g-4';
		content.className = 'library-detail__content col-12 col-lg';
		addTextContent( content, post.content && post.content.rendered ? post.content.rendered.replace( /<[^>]*>/g, '' ) : '' );

		if ( data.installation ) {
			content.appendChild( textNode( 'h3', '', data.installation_title || 'Instalación' ) );
			addInstallationText( content, data.installation );
		}

		installationRow.appendChild( content );

		if ( imageUrl( data.image ) ) {
			var imageColumn = textNode( 'div', 'library-detail__image col-12 col-lg-4', '' );
			var image = document.createElement( 'img' );

			image.className = 'img-fluid rounded border';
			image.src = imageUrl( data.image );
			image.alt = post.title.rendered;
			image.loading = 'lazy';
			imageColumn.appendChild( image );
			installationRow.appendChild( imageColumn );
		}

		container.appendChild( installationRow );

		if ( data.example_code ) {
			var codeBox = textNode( 'div', 'library-detail__code', '' );
			var pre = document.createElement( 'pre' );

			codeBox.appendChild( textNode( 'span', '', 'CÓDIGO DE EJEMPLO' ) );
			pre.className = 'mb-0';
			pre.appendChild( textNode( 'code', '', data.example_code ) );
			codeBox.appendChild( pre );
			container.appendChild( codeBox );
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
			container.appendChild( linkBox );
		}
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
		summary.appendChild( textNode( 'p', '', data.description || 'Sin descripción disponible.' ) );
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
		document.querySelectorAll( '[data-library-filter]' ).forEach( function( filter ) {
			filter.addEventListener( 'click', function( event ) {
				event.preventDefault();
				activeFilter = filter.dataset.libraryFilter;
				document.querySelectorAll( '[data-library-filter]' ).forEach( function( item ) {
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
				} ).done( function( posts ) {
					if ( requestId !== searchRequest ) {
						return;
					}
					activeSearch = value;
					renderCatalog( Array.isArray( posts ) ? posts : [] );
				} ).fail( function( xhr, status, error ) {
					if ( requestId !== searchRequest ) {
						return;
					}
					console.error( 'Error buscando módulos en REST:', status, error, xhr.status );
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
			.done( function( posts ) {
				catalogPosts = Array.isArray( posts ) ? posts : [];
				updateCounts();
				renderCatalog( catalogPosts );
				initSearch( endpoint, perPage );
			} )
			.fail( function( xhr, status, error ) {
				console.error( 'Error cargando el catálogo REST:', status, error, xhr.status );
				showCatalogError( container );
			} );
	}

	function loadSingleEntry() {
		var article = document.querySelector( '[data-rest-post-id]' );

		if ( ! article || ! config.postsUrl ) {
			return;
		}

		requestJson( config.postsUrl + '/' + encodeURIComponent( article.dataset.restPostId ) + '?_embed' )
			.done( function( post ) {
				var data = resourceData( post );
				var content = article.querySelector( '.library-entry__content' );

				content.replaceChildren();
				addTextContent( content, data.description, 'library-entry__description mb-4' );
				if ( post.content && post.content.rendered ) {
					var body = document.createElement( 'div' );
					body.className = 'library-entry__body';
					body.innerHTML = post.content.rendered;
					content.appendChild( body );
				}
				addDetailSections( content, post, data );
			} )
			.fail( function( xhr, status, error ) {
				console.error( 'Error cargando el detalle REST:', status, error, xhr.status );
				var content = article.querySelector( '.library-entry__content' );

				if ( content ) {
					content.textContent = 'No fue posible cargar el detalle desde la API REST.';
				}
			} );
	}

	initFilters();
	loadCatalog();
	loadSingleEntry();
}() );
