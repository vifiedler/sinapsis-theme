(function () {
	'use strict';

	var apiUrl = window.bd_ajax && window.bd_ajax.posts_url;

	function textNode(tag, className, text) {
		var element = document.createElement(tag);
		if (className) {
			element.className = className;
		}
		element.textContent = text || '';
		return element;
	}

	function addTextContent(container, value, className) {
		if (!value) {
			return;
		}

		String(value).split(/\n{2,}/).forEach(function (paragraph) {
			container.appendChild(textNode('p', className, paragraph.trim()));
		});
	}

	function addInstallationList(container, value) {
		if (!value) {
			return;
		}
		var list = document.createElement('ol');
		list.className = 'library-detail__installation-list';
		String(value).split(/\r?\n/).map(function (line) {
			return line.trim();
		}).filter(Boolean).forEach(function (line) {
			var item = document.createElement('li');
			item.textContent = line.replace(/^\d+[.)]\s*/, '');
			list.appendChild(item);
		});
		container.appendChild(list);
	}

	function resourceData(post) {
		var data = post.sinapsis || post.acf || {};
		if (!data.image && data.imagen) {
			data.image = data.imagen;
		}
		if (!data.description && data.descripcion) {
			data.description = data.descripcion;
		}
		if (!data.difficulty && data.dificultad) {
			data.difficulty = data.dificultad;
		}
		if (!data.installation && data.instalacion) {
			data.installation = data.instalacion;
		}
		if (!data.installation_title && data['titulo-instalacion']) {
			data.installation_title = data['titulo-instalacion'];
		}
		if (!data.example_code && data['codigo-ejemplo']) {
			data.example_code = data['codigo-ejemplo'];
		}
		if (!data.shelves && post._embedded && post._embedded['wp:term']) {
			data.shelves = post._embedded['wp:term'].reduce(function (terms, group) {
				return terms.concat(group.filter(function (term) {
					return term.taxonomy === 'categoria-libreria';
				}).map(function (term) {
					return { name: term.name, slug: term.slug };
				}));
			}, []);
		}
		if (!data.resource_type && post._embedded && post._embedded['wp:term']) {
			var categories = post._embedded['wp:term'].reduce(function (terms, group) {
				return terms.concat(group);
			}, []);
			data.resource_type = categories.some(function (term) {
				return term.taxonomy === 'category' && term.slug === 'plugin';
			}) ? 'Plugin' : 'Librería';
		}
		return data;
	}

	function imageUrl(image) {
		if (!image) {
			return '';
		}
		if (typeof image === 'string') {
			return image;
		}
		return image.url || (image.sizes && (image.sizes.large || image.sizes.medium)) || '';
	}

	function shelfName(post) {
		var shelves = resourceData(post).shelves || [];
		return shelves.length && shelves[0].name ? shelves[0].name : 'Sin clasificar';
	}

	function createShelf(name) {
		var shelf = document.createElement('section');
		shelf.className = 'library-shelf';
		shelf.dataset.shelf = name;
		shelf.appendChild(textNode('h2', 'library-shelf__title', name));
		var grid = document.createElement('div');
		grid.className = 'library-catalog__grid row g-3';
		shelf.appendChild(grid);
		return shelf;
	}

	function createCard(post) {
		var data = resourceData(post);
		var id = String(post.id);
		var details = document.createElement('details');
		var summary = document.createElement('summary');
		var meta = document.createElement('div');
		var footer = document.createElement('div');
		var detail = document.createElement('div');

		details.id = 'post-' + id;
		details.className = 'library-item col-12 col-md-6 col-xl-4';
		details.draggable = true;
		details.dataset.id = id;
		details.dataset.nombre = post.title.rendered;

		summary.className = 'library-card d-flex flex-column';
		meta.className = 'library-card__meta d-flex justify-content-between align-items-center';
		meta.appendChild(textNode('span', 'module-id', 'MOD-' + id.padStart(3, '0')));
		meta.appendChild(textNode('span', 'library-type', data.resource_type || 'Librería'));
		summary.appendChild(meta);
		summary.appendChild(textNode('h2', 'mt-4', post.title.rendered));

		var level = textNode('div', 'library-card__level', '');
		level.appendChild(textNode('span', '', 'NIVEL:'));
		level.appendChild(document.createTextNode(' ' + (data.difficulty || 'No especificada')));
		summary.appendChild(level);
		summary.appendChild(textNode('p', '', data.description || 'Sin descripción disponible.'));

		footer.className = 'library-card__footer d-flex justify-content-between align-items-center mt-auto';
		footer.appendChild(textNode('span', '', data.resource_type || 'Librería'));
		footer.appendChild(textNode('span', 'show-label', 'Mostrar →'));
		summary.appendChild(footer);

		detail.className = 'library-detail';
		var detailIntro = textNode('div', 'library-detail__intro', '');
		detailIntro.appendChild(textNode('span', 'eyebrow', 'INSPECTOR / ' + id));
		detailIntro.appendChild(textNode('h2', '', post.title.rendered));
		addTextContent(detailIntro, data.description);
		detail.appendChild(detailIntro);
		addDetailSections(detail, post, data);

		details.appendChild(summary);
		details.appendChild(detail);
		return details;
	}

	function addDetailSections(container, post, data) {
		var installationRow = document.createElement('div');
		installationRow.className = 'library-detail__installation row g-4';
		var content = document.createElement('div');
		content.className = 'library-detail__content col-12 col-lg';
		addTextContent(content, post.content && post.content.rendered ? post.content.rendered.replace(/<[^>]*>/g, '') : '');
		if (data.installation) {
			content.appendChild(textNode('h3', '', data.installation_title || 'Instalación'));
			addInstallationList(content, data.installation);
		}
		installationRow.appendChild(content);
		if (imageUrl(data.image)) {
			var imageColumn = textNode('div', 'library-detail__image col-12 col-lg-4', '');
			var image = document.createElement('img');
			image.className = 'img-fluid rounded border';
			image.src = imageUrl(data.image);
			image.alt = post.title.rendered;
			image.loading = 'lazy';
			imageColumn.appendChild(image);
			installationRow.appendChild(imageColumn);
		}
		container.appendChild(installationRow);

		if (data.example_code) {
			var code = textNode('code', '', data.example_code);
			var codeBox = textNode('div', 'library-detail__code', '');
			codeBox.appendChild(textNode('span', '', 'CÓDIGO DE EJEMPLO'));
			var pre = document.createElement('pre');
			pre.className = 'mb-0';
			pre.appendChild(code);
			codeBox.appendChild(pre);
			container.appendChild(codeBox);
		}

		if (data.link) {
			var linkBox = textNode('div', 'library-detail__actions', '');
			var link = document.createElement('a');
			link.className = 'btn btn-outline-light btn-sm';
			link.href = data.link;
			link.rel = 'external noopener';
			link.target = '_blank';
			link.textContent = 'Visitar recurso';
			linkBox.appendChild(link);
			container.appendChild(linkBox);
		}
	}

	function showCatalogError(container) {
		container.replaceChildren(textNode('p', 'catalog-status', 'No fue posible cargar los módulos desde la API REST.'));
	}

	function appendFavorite(zone, data) {
		var favorite = textNode('div', 'favorito-item', '');
		favorite.dataset.id = data.id;
		favorite.appendChild(textNode('span', '', data.nombre));
		var remove = textNode('button', 'favorito-item__remove', '×');
		remove.type = 'button';
		remove.setAttribute('aria-label', 'Eliminar ' + data.nombre + ' de favoritos');
		favorite.appendChild(remove);
		zone.appendChild(favorite);
		zone.querySelectorAll('.texto-vacio').forEach(function (element) {
			element.style.display = 'none';
		});
	}

	function restoreFavorites() {
		var zone = document.getElementById('zona-favoritos');
		if (!zone) {
			return;
		}
		var favorites;
		try {
			favorites = JSON.parse(localStorage.getItem('bd_favoritos') || '[]');
		} catch (error) {
			console.error('No fue posible restaurar los favoritos:', error);
			favorites = [];
		}
		favorites.forEach(function (favorite) {
			if (favorite.id && favorite.nombre && !zone.querySelector('[data-id="' + favorite.id + '"]')) {
				appendFavorite(zone, favorite);
			}
		});
	}

	function loadCatalog() {
		var container = document.getElementById('library-catalog');
		if (!container || !apiUrl) {
			return;
		}

		fetch(apiUrl + '?per_page=100&_embed')
			.then(function (response) {
				if (!response.ok) {
					throw new Error('REST request failed: ' + response.status);
				}
				return response.json();
			})
			.then(function (posts) {
				container.replaceChildren();
				document.getElementById('catalog-count').textContent = String(posts.length).padStart(2, '0');
				document.querySelectorAll('[data-catalog-count]').forEach(function (count) {
					count.textContent = String(posts.length).padStart(2, '0');
				});
				if (!posts.length) {
					container.appendChild(textNode('p', 'catalog-status', 'No hay módulos publicados.'));
					return;
				}
				var shelves = {};
				posts.forEach(function (post) {
					var name = shelfName(post);
					if (!shelves[name]) {
						shelves[name] = createShelf(name);
						container.appendChild(shelves[name]);
					}
					shelves[name].querySelector('.library-catalog__grid').appendChild(createCard(post));
				});
			})
			.catch(function (error) {
				console.error('Error cargando el catálogo REST:', error);
				showCatalogError(container);
			});
	}

	function loadSingleEntry() {
		var article = document.querySelector('[data-rest-post-id]');
		if (!article || !apiUrl) {
			return;
		}

		var postId = article.dataset.restPostId;
		fetch(apiUrl + '/' + encodeURIComponent(postId) + '?_embed')
			.then(function (response) {
				if (!response.ok) {
					throw new Error('REST request failed: ' + response.status);
				}
				return response.json();
			})
			.then(function (post) {
				var data = resourceData(post);
				article.querySelector('.entry-title').textContent = post.title.rendered;
				var content = article.querySelector('.library-entry__content');
				content.replaceChildren();
				addTextContent(content, data.description, 'library-entry__description mb-4');
				if (post.content && post.content.rendered) {
					var body = document.createElement('div');
					body.className = 'library-entry__body';
					body.innerHTML = post.content.rendered;
					content.appendChild(body);
				}
				var installationRow = document.createElement('div');
				installationRow.className = 'library-detail__installation row g-4';
				var installationColumn = textNode('div', 'col-12 col-lg', '');
				if (data.installation) {
					installationColumn.appendChild(textNode('h2', '', data.installation_title || 'Instalación'));
					addInstallationList(installationColumn, data.installation);
				}
				installationRow.appendChild(installationColumn);
				if (imageUrl(data.image)) {
					var imageColumn = textNode('div', 'library-detail__image col-12 col-lg-4', '');
					var image = document.createElement('img');
					image.className = 'img-fluid rounded border';
					image.src = imageUrl(data.image);
					image.alt = post.title.rendered;
					image.loading = 'lazy';
					imageColumn.appendChild(image);
					installationRow.appendChild(imageColumn);
				}
				if (data.installation || imageUrl(data.image)) {
					content.appendChild(installationRow);
				}
				if (data.example_code) {
					var codeSection = textNode('section', 'library-entry__section my-4', '');
					codeSection.appendChild(textNode('h2', '', 'Código de ejemplo'));
					var pre = document.createElement('pre');
					pre.className = 'library-entry__code';
					pre.appendChild(textNode('code', '', data.example_code));
					codeSection.appendChild(pre);
					content.appendChild(codeSection);
				}
				if (data.link) {
					var link = document.createElement('a');
					link.className = 'btn btn-outline-light btn-sm';
					link.href = data.link;
					link.rel = 'external noopener';
					link.target = '_blank';
					link.textContent = 'Visitar recurso';
					content.appendChild(link);
				}
			})
			.catch(function (error) {
				console.error('Error cargando el detalle REST:', error);
				article.querySelector('.library-entry__content').textContent = 'No fue posible cargar el detalle desde la API REST.';
			});
	}

	document.addEventListener('dragstart', function (event) {
		var card = event.target.closest('.library-item');
		if (!card) {
			return;
		}
		event.dataTransfer.setData('text/plain', JSON.stringify({
			id: card.dataset.id,
			nombre: card.dataset.nombre
		}));
		event.dataTransfer.effectAllowed = 'copy';
		card.style.opacity = '0.5';
	});

	document.addEventListener('dragend', function (event) {
		var card = event.target.closest('.library-item');
		if (card) {
			card.style.opacity = '1';
		}
	});

	document.addEventListener('dragover', function (event) {
		var zone = event.target.closest('#zona-favoritos');
		if (zone) {
			event.preventDefault();
			zone.style.borderColor = '#dc3545';
			zone.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
		}
	});

	document.addEventListener('dragleave', function (event) {
		var zone = event.target.closest('#zona-favoritos');
		if (zone) {
			zone.style.borderColor = '#444';
			zone.style.backgroundColor = '';
		}
	});

	document.addEventListener('drop', function (event) {
		var zone = event.target.closest('#zona-favoritos');
		if (!zone) {
			return;
		}
		event.preventDefault();
		zone.style.borderColor = '#444';
		zone.style.backgroundColor = '';
		var dataString = event.dataTransfer.getData('text/plain');
		if (!dataString) {
			return;
		}
		var data;
		try {
			data = JSON.parse(dataString);
		} catch (error) {
			console.error('Error leyendo el módulo arrastrado:', error);
			return;
		}
		if (!data.id || !data.nombre || zone.querySelector('[data-id="' + data.id + '"]')) {
			return;
		}
		appendFavorite(zone, data);
		var favorites;
		try {
			favorites = JSON.parse(localStorage.getItem('bd_favoritos') || '[]');
		} catch (error) {
			console.error('No fue posible leer los favoritos guardados:', error);
			favorites = [];
		}
		if (!favorites.some(function (item) { return item.id === data.id; })) {
			favorites.push({ id: data.id, nombre: data.nombre });
			localStorage.setItem('bd_favoritos', JSON.stringify(favorites));
		}
	});

	document.addEventListener('click', function (event) {
		var removeButton = event.target.closest('.favorito-item__remove');
		if (!removeButton) {
			return;
		}
		var favorite = removeButton.closest('.favorito-item');
		if (!favorite) {
			return;
		}
		var id = favorite.dataset.id;
		favorite.remove();
		var favorites;
		try {
			favorites = JSON.parse(localStorage.getItem('bd_favoritos') || '[]');
		} catch (error) {
			console.error('No fue posible actualizar los favoritos:', error);
			favorites = [];
		}
		localStorage.setItem('bd_favoritos', JSON.stringify(favorites.filter(function (item) {
			return item.id !== id;
		})));
		if (!document.querySelector('#zona-favoritos .favorito-item')) {
			document.querySelectorAll('#zona-favoritos .texto-vacio').forEach(function (element) {
				element.style.display = '';
			});
		}
	});

	loadCatalog();
	loadSingleEntry();
	restoreFavorites();
}());
