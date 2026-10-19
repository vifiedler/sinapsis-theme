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

	function resourceData(post) {
		return post.sinapsis || {};
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

		detail.className = 'library-detail row g-4';
		var detailIntro = textNode('div', 'col-12 col-lg', '');
		detailIntro.appendChild(textNode('span', 'eyebrow', 'INSPECTOR / ' + id));
		detailIntro.appendChild(textNode('h2', '', post.title.rendered));
		addTextContent(detailIntro, data.description);
		if (data.image) {
			var image = document.createElement('img');
			image.className = 'img-fluid rounded border mt-3';
			image.src = data.image;
			image.alt = post.title.rendered;
			image.loading = 'lazy';
			detailIntro.appendChild(image);
		}
		detail.appendChild(detailIntro);
		addDetailSections(detail, post, data);

		details.appendChild(summary);
		details.appendChild(detail);
		return details;
	}

	function addDetailSections(container, post, data) {
		var content = document.createElement('div');
		content.className = 'library-detail__content col-12 col-lg';
		addTextContent(content, post.content && post.content.rendered ? post.content.rendered.replace(/<[^>]*>/g, '') : '');
		if (data.installation) {
			content.appendChild(textNode('h3', '', data.installation_title || 'Instalación'));
			addTextContent(content, data.installation, 'library-detail__formatted-content');
		}
		container.appendChild(content);

		if (data.example_code) {
			var code = textNode('code', '', data.example_code);
			var codeBox = textNode('div', 'library-detail__code col-12 col-lg', '');
			codeBox.appendChild(textNode('span', '', 'CÓDIGO DE EJEMPLO'));
			var pre = document.createElement('pre');
			pre.className = 'mb-0';
			pre.appendChild(code);
			codeBox.appendChild(pre);
			container.appendChild(codeBox);
		}

		if (data.link) {
			var linkBox = textNode('div', 'library-detail__actions col-12 col-lg-auto', '');
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
				posts.forEach(function (post) {
					container.appendChild(createCard(post));
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
				if (data.image) {
					var image = document.createElement('img');
					image.className = 'img-fluid rounded border mb-4';
					image.src = data.image;
					image.alt = post.title.rendered;
					content.appendChild(image);
				}
				addTextContent(content, data.description, 'library-entry__description mb-4');
				if (post.content && post.content.rendered) {
					var body = document.createElement('div');
					body.className = 'library-entry__body';
					body.innerHTML = post.content.rendered;
					content.appendChild(body);
				}
				if (data.installation) {
					content.appendChild(textNode('h2', '', data.installation_title || 'Instalación'));
					addTextContent(content, data.installation);
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
		var favorite = textNode('div', 'favorito-item', data.nombre);
		favorite.dataset.id = data.id;
		zone.appendChild(favorite);
		zone.querySelectorAll('.texto-vacio').forEach(function (element) {
			element.style.display = 'none';
		});
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

	loadCatalog();
	loadSingleEntry();
}());
