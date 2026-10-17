/**
 * js-bdmusic.js
 * Dependencias:
 * JQuery 4
 * YouTube IFrame API
 * Anime.js
 * Bootstrap 5.3 */

(function ($) {
    'use strict';
    // Verificación de edad, solo en homepage
    var esHomepage = window.location.pathname === '/breakdown-music/' || window.location.pathname === '/breakdown-music';

    if (esHomepage) {
        var edad = prompt("Ingresa tu edad para continuar:");
        edad = parseInt(edad);

        if (!isNaN(edad) && edad > 14) {
            alert("Bienvenido a Breakdown Music");
        } else {
            alert("Debes ser mayor de 14 años para ingresar.");
            window.location.href = "https://google.com";
        }
    }
    // Variables globales
    /* Variables del reproductor de YouTube */
    var player = null,
        playerReady = false,
        currentVideoId = '',
        currentTitle = '',
        currentArtist = '',
        currentThumb = '',
        isPlaying = false,
        progressInterval = null,
        isDragging = false,
        currentPostId = null; //ID POST canción actual
    /* Referencias a elementos del DOM */
    var playerBar = $('#bd-player-bar'),
        playerThumb = $('#bd-player-thumb'),
        playerTitle = $('#bd-player-title'),
        playerArtist = $('#bd-player-artist'),
        playerPlayBtn = $('#bd-player-play'),
        playerToggle = $('#bd-player-toggle'),
        progressBar = $('#bd-player-progress-bar'),
        progressWrap = $('#bd-player-progress'),
        timeCurrent = $('#bd-player-time-current'),
        timeTotal = $('#bd-player-time-total');

    // Otras funciones

    /* Extrae el ID de un video de YouTube desde una URL */
    function bdExtractVideoId(url) {
        if (!url) return null;
        var match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/);
        return match ? match[1] : null;
    }

    /* Convierte segundos a formato MM:SS */
    function bdFormatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Reproductor de YT

    function bdInitYouTubePlayer() {
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            return;
        }
        bdCreatePlayer();
    }

    window.onYouTubeIframeAPIReady = function () {
        bdCreatePlayer();
    };

    function bdCreatePlayer() {
        if (player) return;
        player = new YT.Player('bd-youtube-player', {
            height: '1',
            width: '1',
            videoId: '',
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                rel: 0,
                modestbranding: 1
            },
            events: {
                'onReady': bdOnPlayerReady,
                'onStateChange': bdOnPlayerStateChange,
                'onError': function (e) {
                    console.warn('YouTube error:', e.data);
                }
            }
        });
    }

    function bdOnPlayerReady() {
        playerReady = true;
        if (currentVideoId) {
            playerPlayBtn.prop('disabled', false);
            if (isPlaying) player.playVideo();
        }
    }

    function bdOnPlayerStateChange(event) {
        var state = event.data;
        if (state === YT.PlayerState.PLAYING) {
            isPlaying = true;
            playerPlayBtn.html('<i class="bi bi-pause-fill"></i>');
            playerPlayBtn.prop('disabled', false);
            playerBar.removeClass('empty');
            if (progressInterval) clearInterval(progressInterval);
            progressInterval = setInterval(bdUpdateProgress, 500);
        } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
            isPlaying = false;
            playerPlayBtn.html('<i class="bi bi-play-fill"></i>');
            playerPlayBtn.prop('disabled', false);
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            if (state === YT.PlayerState.ENDED) {
                progressBar.css('width', '100%');
                var dur = player.getDuration();
                if (dur) timeCurrent.text(bdFormatTime(dur));
            }
        }
    }

    function bdUpdateProgress() {
        if (!player || !playerReady || isDragging) return;
        try {
            var current = player.getCurrentTime();
            var duration = player.getDuration();
            if (duration > 0) {
                var percent = (current / duration) * 100;
                progressBar.css('width', percent + '%');
                timeCurrent.text(bdFormatTime(current));
                timeTotal.text(bdFormatTime(duration));
            }
        } catch (e) { }
    }

    /* Carga y reproduce una canción. Recibe el postId para guardarlo */
    function bdPlaySong(videoId, title, artist, thumb, postId) {
        if (!videoId) return;
        // Misma canción pausa/reanuda
        if (currentVideoId === videoId) {
            if (player && playerReady) {
                var state = player.getPlayerState();
                if (state === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
            }
            return;
        }

        currentVideoId = videoId;
        currentTitle = title || 'Canción';
        currentArtist = artist || 'Artista';
        currentThumb = thumb || '';
        currentPostId = postId || null;

        // Actualización de Interfaz
        playerTitle.text(currentTitle);
        playerArtist.text(currentArtist);
        playerThumb.attr('src', currentThumb || 'https://img.youtube.com/vi/' + videoId + '/default.jpg');

        playerBar.addClass('visible').removeClass('empty');
        playerBar.removeClass('minimized');
        playerPlayBtn.prop('disabled', true);

        if (player && playerReady) {
            player.loadVideoById(videoId);
            playerPlayBtn.prop('disabled', false);
        } else {
            if (!player) bdInitYouTubePlayer();
            var checkReady = setInterval(function () {
                if (playerReady) {
                    clearInterval(checkReady);
                    player.loadVideoById(videoId);
                    playerPlayBtn.prop('disabled', false);
                }
            }, 200);
        }
    }

    // Exportar funciones globales
    window.bdPlaySong = bdPlaySong;
    window.bdExtractVideoId = bdExtractVideoId;
    window.bdInitYouTubePlayer = bdInitYouTubePlayer;

    // Eventos de reproducción
    // Botón en tarjetas
    $(document).on('click', '.bd-play-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var url = $btn.data('url');
        if (!url) return;

        var videoId = bdExtractVideoId(url);
        if (!videoId) {
            alert('URL de YouTube no válida');
            return;
        }

        var title = $btn.data('title') || $btn.closest('.bd-card').find('.bd-card-title').text().trim() || 'Canción';
        var artist = $btn.data('artist') || $btn.closest('.bd-card').find('.bd-card-sub').text().trim() || 'Artista';
        var thumb = $btn.data('thumb') || $btn.closest('.bd-card').find('img').attr('src') || '';
        var postId = $btn.data('post-id') || $btn.closest('.bd-card').data('post-id') || 0;

        if (!player) bdInitYouTubePlayer();
        bdPlaySong(videoId, title, artist, thumb, postId);

        $btn.css('transform', 'scale(0.8)');
        setTimeout(function () { $btn.css('transform', 'scale(1)'); }, 200);
    });

    // Botón en listas de canciones
    $(document).on('click', '.bd-play-btn-track', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var url = $btn.data('url');
        if (!url) return;

        var videoId = bdExtractVideoId(url);
        if (!videoId) {
            alert('URL de YouTube no válida');
            return;
        }

        var title = $btn.data('title') || 'Canción';
        var artist = $btn.data('artist') || 'Artista';
        var thumb = $btn.data('thumb') || '';
        var postId = $btn.data('post-id') || 0;

        if (!player) bdInitYouTubePlayer();
        bdPlaySong(videoId, title, artist, thumb, postId);

        $btn.css('transform', 'scale(0.8)');
        setTimeout(function () { $btn.css('transform', 'scale(1)'); }, 200);
    });

    // Botón principal en single canción
    $(document).on('click', '#bd-play-main', function (e) {
        e.preventDefault();

        var $btn = $(this);
        var url = $btn.data('url');
        if (!url) return;

        var videoId = bdExtractVideoId(url);
        if (!videoId) {
            alert('URL de YouTube no válida');
            return;
        }

        var title = $('#bd-single-titulo').text().trim() || 'Canción';
        var artist = $('#bd-single-artista').text().trim() || 'Artista';
        var thumb = $('.bd-single-cover img').attr('src') || '';
        var postId = $btn.data('post-id') || 0;

        if (!player) bdInitYouTubePlayer();
        bdPlaySong(videoId, title, artist, thumb, postId);

        $btn.css('transform', 'scale(0.9)');
        setTimeout(function () { $btn.css('transform', 'scale(1)'); }, 200);
    });

    // Botón play/pausa del reproductor
    $('#bd-player-play').on('click', function () {
        if (!player || !playerReady) {
            console.warn('Reproductor no listo');
            return;
        }
        var state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED || state === -1) {
            player.playVideo();
        }
    });

    // Barra de progreso
    progressWrap.on('mousedown', function (e) {
        if (!player || !playerReady) return;
        isDragging = true;
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var percent = Math.max(0, Math.min(1, x / rect.width));
        var duration = player.getDuration();
        if (duration > 0) {
            var seekTime = percent * duration;
            player.seekTo(seekTime, true);
            progressBar.css('width', percent * 100 + '%');
            timeCurrent.text(bdFormatTime(seekTime));
        }
        $(document).on('mousemove.bdProgress', function (e2) {
            var rect2 = progressWrap[0].getBoundingClientRect();
            var x2 = e2.clientX - rect2.left;
            var percent2 = Math.max(0, Math.min(1, x2 / rect2.width));
            progressBar.css('width', percent2 * 100 + '%');
            if (player && playerReady) {
                var dur = player.getDuration();
                if (dur > 0) timeCurrent.text(bdFormatTime(percent2 * dur));
            }
        });
        $(document).on('mouseup.bdProgress', function () {
            isDragging = false;
            $(document).off('mousemove.bdProgress mouseup.bdProgress');
            bdUpdateProgress();
        });
    });

    /* Evento del chevron: abre el modal */
    playerToggle.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var postId = currentPostId;
        if (!postId) {
            console.warn('No hay canción seleccionada para mostrar en el modal.');
            return;
        }
        // Si el reproductor está minimizado, expandirlo
        if (playerBar.hasClass('minimized')) {
            playerBar.removeClass('minimized');
            $(this).find('i').removeClass('bi-chevron-up').addClass('bi-chevron-down');
        }

        var modalBody = $('#bd-song-modal-body');
        modalBody.html(
            '<div class="text-center py-5">' +
            '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Cargando...</span></div>' +
            '</div>'
        );

        // Verificar que bd_ajax esté definido
        if (typeof bd_ajax === 'undefined' || !bd_ajax.rest_url) {
            console.error('bd_ajax no está definido. Revisa wp_localize_script.');
            modalBody.html('<p class="text-danger">Error de configuración. No se pudo cargar el contenido.</p>');
            return;
        }

        var apiUrl = bd_ajax.rest_url + 'song-content/' + postId;
        console.log('Cargando modal desde:', apiUrl);

        fetch(apiUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (data.html) {
                    modalBody.html(data.html);
                    // Abrir el modal
                    var modalElement = document.getElementById('bdSongModal');
                    if (modalElement) {
                        var modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    } else {
                        console.error('No se encontró el elemento #bdSongModal');
                    }
                } else {
                    modalBody.html('<p class="text-danger">Error: No se pudo cargar el contenido.</p>');
                }
            })
            .catch(function (error) {
                console.error('Error al cargar el modal:', error);
                modalBody.html('<p class="text-danger">Error de conexión. Intenta nuevamente.</p>');
            });
    });

    // Iniciar reproductor
    bdInitYouTubePlayer();
    // Limpiar intervalo al salir
    $(window).on('beforeunload', function () {
        if (progressInterval) clearInterval(progressInterval);
    });

    // Carrusel cards
    if ($('.bd-carousel-track').length) {

        if (typeof anime !== 'undefined') {
            anime({
                targets: '.bd-card',
                opacity: [0, 1],
                translateY: [8, 0],
                duration: 200,
                easing: 'easeOutQuad'
            });
        } else {
            $('.bd-card').addClass('fade-in-up');
        }

        var BD_CARDS_PER_PAGE = 3;

        function bdActualizarBotones($section) {
            var $track = $section.find('.bd-carousel-track');
            var $cards = $track.find('.bd-card');
            var totalPages = Math.ceil($cards.length / BD_CARDS_PER_PAGE);
            var page = parseInt($track.data('page')) || 0;

            $section.find('.bd-carousel-prev').prop('disabled', page <= 0);
            $section.find('.bd-carousel-next').prop('disabled', page >= totalPages - 1);
        }

        function bdIrAPagina($section, nuevaPagina) {
            var $track = $section.find('.bd-carousel-track');
            var $cards = $track.find('.bd-card');
            if (!$cards.length) return;

            var totalPages = Math.ceil($cards.length / BD_CARDS_PER_PAGE);
            nuevaPagina = Math.max(0, Math.min(nuevaPagina, totalPages - 1));

            var targetIndex = nuevaPagina * BD_CARDS_PER_PAGE;
            var $targetCard = $cards.eq(targetIndex);
            if (!$targetCard.length) return;

            var destino = $targetCard.position().left + $track.scrollLeft();
            $track.animate({ scrollLeft: destino }, 400);
            $track.data('page', nuevaPagina);
            bdActualizarBotones($section);
        }

        $('.bd-section-head .bd-carousel-prev').on('click', function () {
            var $section = $(this).closest('.bd-section');
            var $track = $section.find('.bd-carousel-track');
            var page = parseInt($track.data('page')) || 0;
            bdIrAPagina($section, page - 1);
        });

        $('.bd-section-head .bd-carousel-next').on('click', function () {
            var $section = $(this).closest('.bd-section');
            var $track = $section.find('.bd-carousel-track');
            var page = parseInt($track.data('page')) || 0;
            bdIrAPagina($section, page + 1);
        });

        $('.bd-section').each(function () {
            bdActualizarBotones($(this));
        });

        window.bdReinitCarousel = function () {
            if ($('.bd-carousel-track').length) {
                $('.bd-section').each(function () {
                    bdActualizarBotones($(this));
                });
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: '.bd-card',
                        opacity: [0, 1],
                        translateY: [8, 0],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            }
        };
    }

    // Nav por AJAX
    $(document).on('click', 'a', function (e) {
        var $link = $(this);
        var href = $link.attr('href');

        if (!href || href.trim() === '') return;
        if (href === '#') return;
        if (href.indexOf('javascript:') === 0) return;
        if (href.indexOf('mailto:') === 0) return;
        if (href.indexOf('tel:') === 0) return;
        if (href.match(/^#/)) return;
        if (href.match(/^http/)) return;
        if (href.indexOf('wp-admin') !== -1 || href.indexOf('wp-login') !== -1) return;
        if ($link.hasClass('no-ajax')) return;
        if (href.match(/\.(pdf|zip|doc|docx|jpg|png|gif|mp3|mp4)$/i)) return;

        e.preventDefault();
        bdLoadPage(href);
    });

    function bdLoadPage(url) {
        if (!url || url.trim() === '' || url === '#') {
            console.warn('URL inválida, cancelando petición');
            return;
        }

        console.log('Cargando AJAX:', url);

        $('#bd-content').html(
            '<div class="text-center py-5">' +
            '<div class="spinner-border text-light" role="status">' +
            '<span class="visually-hidden">Cargando...</span>' +
            '</div>' +
            '</div>'
        );

        fetch(url, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                var $html = $('<div></div>').html(html);
                var newContent = $html.find('#bd-content').html();

                if (newContent) {
                    $('#bd-content').html(newContent);
                } else {
                    var fallback = $html.find('#primary').html() || $html.find('main').html();
                    if (fallback) {
                        $('#bd-content').html(fallback);
                    } else {
                        $('#bd-content').html('<p class="text-danger">Error: No se pudo cargar el contenido.</p>');
                        return;
                    }
                }

                var newTitle = $html.filter('title').text();
                if (newTitle) document.title = newTitle;

                if (window.history && window.history.pushState) {
                    window.history.pushState({}, '', url);
                }

                if (typeof window.bdReinitCarousel === 'function') {
                    window.bdReinitCarousel();
                }

                window.scrollTo(0, 0);
            })
            .catch(function (error) {
                console.error('Error en AJAX:', error);
                window.location.href = url;
            });
    }

    $(window).on('popstate', function () {
        bdLoadPage(location.href);
    });

    // Búsqueda en tiempo real por AJAX
    var searchTimeout = null;

    function bdPerformSearch(query) {
        if (!query || query.length < 2) {
            $('#bd-search-results').hide().empty();
            return;
        }

        $.ajax({
            url: bd_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'bd_ajax_search',
                search: query,
                nonce: bd_ajax.nonce
            },
            success: function (response) {
                var $results = $('#bd-search-results');
                if (response.success && response.data.length > 0) {
                    var html = '';
                    $.each(response.data, function (index, item) {
                        html += '<div class="bd-result-item" data-url="' + item.permalink + '">';
                        html += '<span>' + item.title + '</span>';
                        html += '<span>' + item.type + '</span>';
                        html += '</div>';
                    });
                    html += '<div class="bd-result-item" id="bd-ver-todos" data-url="' + bd_ajax.search_url + '?s=' + encodeURIComponent(query) + '">';
                    html += '<span>Ver todos los resultados para "' + query + '"</span>';
                    html += '<span>→</span>';
                    html += '</div>';
                    $results.html(html).show();
                } else {
                    $results.html('<div class="bd-result-item text-muted">No se encontraron resultados.</div>').show();
                }
            },
            error: function () {
                console.warn('Error en la búsqueda AJAX');
            }
        });
    }

    $('#bd-search-input').on('input', function () {
        clearTimeout(searchTimeout);
        var query = $(this).val().trim();
        searchTimeout = setTimeout(function () {
            bdPerformSearch(query);
        }, 300);
    });

    $(document).on('click', '.bd-result-item:not(#bd-ver-todos)', function () {
        var url = $(this).data('url');
        if (url) window.location.href = url;
    });

    $(document).on('click', '#bd-ver-todos', function () {
        var url = $(this).data('url');
        if (url) window.location.href = url;
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.bd-search-form').length) {
            $('#bd-search-results').hide();
        }
    });

    // Scroll Infinito en canciones del género
    var genreContainer = $('#bd-genre-songs-container');

    if (genreContainer.length) {
        var genreSlug = genreContainer.data('genre');
        var albumId = genreContainer.data('album-id');
        var currentPage = parseInt(genreContainer.data('page')) || 1;
        var totalPages = parseInt(genreContainer.data('total-pages')) || 0;
        var loading = false;
        var endReached = false;

        var $list = $('#bd-genre-songs-list');
        var $loader = $('#bd-genre-loader');
        var $end = $('#bd-genre-end');

        function bdLoadGenreSongs(page) {
            if (loading || endReached) return;
            loading = true;
            $loader.show();

            if (!genreSlug) {
                console.warn('Genre slug no definido');
                $loader.hide();
                loading = false;
                return;
            }

            $.ajax({
                url: bd_ajax.rest_url + 'songs-by-genre/' + genreSlug,
                method: 'GET',
                data: {
                    page: page,
                    per_page: 10,
                    exclude_album: albumId
                },
                success: function (response) {
                    if (response.songs && response.songs.length > 0) {
                        var $items = $();
                        $.each(response.songs, function (index, song) {
                            var duration = song.duration ?
                                String(Math.floor(song.duration / 60)).padStart(2, '0') + ':' + String(song.duration % 60).padStart(2, '0') :
                                '';
                            //Insertar por JSON
                            var $item = $(`
                                <div class="bd-song-card d-flex align-items-center gap-3 p-2 rounded-3" style="cursor:pointer;">
                                    <div class="bd-song-thumb-wrap position-relative flex-shrink-0" style="width:52px;height:52px;">
                                        <img src="${song.thumbnail}" alt="${song.title}" class="w-100 h-100 rounded" style="object-fit:cover;">
                                        <button class="bd-play-btn-track position-absolute top-50 start-50 translate-middle bg-danger border-0 rounded-circle d-flex align-items-center justify-content-center" 
                                                data-url="${song.url}" data-thumb="${song.thumbnail}" data-title="${song.title}" data-artist="${song.artist}" data-post-id="${song.id}"
                                                style="width:32px;height:32px;opacity:0;transition:opacity 0.2s;">
                                            <i class="bi bi-play-fill text-white" style="font-size:0.9rem;"></i>
                                        </button>
                                    </div>
                                    <div class="bd-song-info flex-grow-1 min-width-0">
                                        <p class="bd-song-title fw-semibold text-truncate mb-0">
                                            <a href="${song.permalink}" class="text-white text-decoration-none">${song.title}</a>
                                        </p>
                                        <p class="bd-song-sub text-secondary text-truncate small mb-0">${song.artist}</p>
                                    </div>
                                    <span class="bd-song-duration text-secondary small">${duration}</span>
                                </div>
                            `);
                            $items = $items.add($item);
                        });

                        $list.append($items);

                        if (typeof anime !== 'undefined') {
                            anime({
                                targets: $items.toArray(),
                                opacity: [0, 1],
                                translateY: [12, 0],
                                delay: anime.stagger(40),
                                duration: 350,
                                easing: 'easeOutQuad'
                            });
                        } else {
                            $items.css('opacity', 1);
                        }

                        totalPages = response.total_pages;
                        currentPage = page;
                        genreContainer.data('page', currentPage).data('total-pages', totalPages);

                        if (currentPage >= totalPages) {
                            endReached = true;
                            $end.show();
                        }
                    } else {
                        endReached = true;
                        $end.show();
                    }
                    $loader.hide();
                    loading = false;
                },
                error: function () {
                    $loader.hide();
                    loading = false;
                    console.warn('Error al cargar canciones del género');
                }
            });
        }

        bdLoadGenreSongs(1);

        $(window).on('scroll', function () {
            if (endReached || loading) return;
            var containerBottom = genreContainer.offset().top + genreContainer.outerHeight();
            var windowBottom = $(window).scrollTop() + $(window).height();
            if (windowBottom > containerBottom - 200) {
                bdLoadGenreSongs(currentPage + 1);
            }
        });
    }

    // Scroll Infinito en archive de canciones
    var archiveContainer = $('#bd-all-songs-container');

    if (archiveContainer.length) {
        var currentPage = parseInt(archiveContainer.data('page')) || 1;
        var totalPages = parseInt(archiveContainer.data('total-pages')) || 0;
        var loading = false;
        var endReached = false;
        var trackCounter = 1;
        var scrollTimeout = false;

        var $list = $('#bd-all-songs-list');
        var $loader = $('#bd-all-songs-loader');
        var $end = $('#bd-all-songs-end');

        function bdLoadAllSongs(page) {
            if (loading || endReached) return;
            loading = true;
            $loader.show();

            var orderby = archiveContainer.data('orderby') || 'title';
            var order = archiveContainer.data('order') || 'ASC';

            if (typeof bd_ajax === 'undefined' || !bd_ajax.rest_url) {
                console.error('bd_ajax.rest_url no está definido');
                $loader.hide();
                loading = false;
                return;
            }

            $.ajax({
                url: bd_ajax.rest_url + 'all-songs',
                method: 'GET',
                data: {
                    page: page,
                    per_page: 12,
                    orderby: orderby,
                    order: order
                },
                success: function (response) {
                    if (response.songs && response.songs.length > 0) {
                        var $items = $();
                        $.each(response.songs, function (index, song) {
                            var duration = song.duration ?
                                String(Math.floor(song.duration / 60)).padStart(2, '0') + ':' + String(song.duration % 60).padStart(2, '0') :
                                '';
                            //JSON
                            var $item = $(`
                                <div class="bd-artist-song-row d-flex align-items-center gap-3 p-2 rounded-3 w-100" data-id="${song.id}">
                                    <span class="d-flex align-items-center gap-1 flex-shrink-0" style="width:40px;">
                                        <button class="bd-play-btn-track bg-transparent border-0 text-secondary p-0" 
                                                data-url="${song.url}" data-thumb="${song.thumbnail}" data-title="${song.title}" data-artist="${song.artist}" data-post-id="${song.id}"
                                                title="Reproducir">
                                            <i class="bi bi-play-fill" style="font-size:1rem;"></i>
                                        </button>
                                        <span class="small text-secondary">${trackCounter}</span>
                                    </span>
                                    <img src="${song.thumbnail}" alt="${song.title}" class="bd-artist-song-thumb rounded-2 flex-shrink-0" style="width:42px;height:42px;object-fit:cover;">
                                    <div class="flex-grow-1 min-width-0">
                                        <p class="fw-semibold text-truncate mb-0">
                                            <a href="${song.permalink}" class="text-white text-decoration-none">${song.title}</a>
                                        </p>
                                        <p class="text-secondary text-truncate small mb-0">${song.artist}</p>
                                    </div>
                                    <span class="text-secondary small flex-shrink-0">${duration}</span>
                                    <button class="bd-artist-song-like bg-transparent border-0 text-secondary flex-shrink-0" data-id="${song.id}">
                                        <i class="bi bi-hand-thumbs-up"></i>
                                    </button>
                                </div>
                            `);
                            $items = $items.add($item);
                            trackCounter++;
                        });

                        $list.append($items);

                        if (typeof anime !== 'undefined') {
                            anime({
                                targets: $items.toArray(),
                                opacity: [0, 1],
                                translateY: [8, 0],
                                delay: anime.stagger(30),
                                duration: 300,
                                easing: 'easeOutQuad'
                            });
                        } else {
                            $items.css('opacity', 1);
                        }

                        totalPages = response.total_pages;
                        currentPage = page;
                        archiveContainer.data('page', currentPage).data('total-pages', totalPages);

                        if (currentPage >= totalPages) {
                            endReached = true;
                            $end.show();
                        }
                    } else {
                        endReached = true;
                        $end.show();
                    }
                    $loader.hide();
                    loading = false;
                },
                error: function () {
                    $loader.hide();
                    loading = false;
                    console.warn('Error al cargar canciones');
                }
            });
        }

        bdLoadAllSongs(1);

        $(window).on('scroll', function () {
            if (scrollTimeout) return;
            scrollTimeout = true;
            setTimeout(function () {
                scrollTimeout = false;
                if (endReached || loading) return;
                var containerBottom = archiveContainer.offset().top + archiveContainer.outerHeight();
                var windowBottom = $(window).scrollTop() + $(window).height();
                if (windowBottom > containerBottom - 300) {
                    bdLoadAllSongs(currentPage + 1);
                }
            }, 200);
        });
    }

    // Animaciones para acordeón con animejs
    if (typeof anime !== 'undefined') {
        var accordionItems = document.querySelectorAll('.accordion-item');
        if (accordionItems.length) {
            anime({
                targets: accordionItems,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                delay: anime.stagger(100, { start: 200 }),
                easing: 'easeOutQuad'
            });
        }

        document.querySelectorAll('.accordion-collapse').forEach(function (el) {
            el.addEventListener('show.bs.collapse', function () {
                var header = this.closest('.accordion-item').querySelector('.accordion-header');
                if (header) {
                    anime({
                        targets: header,
                        scale: [0.98, 1],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
    }
    // Hamburguer button
    var $sidebar = $('#bd-sidebar');
    $('#bd-burger').removeAttr('data-bs-toggle').removeAttr('data-bs-target');
    $('#bd-burger').on('click', function (e) {
        e.preventDefault();
        if (window.innerWidth <= 768) {
            $sidebar.toggleClass('open');
        }
    });
    $(window).on('resize', function () {
        if (window.innerWidth > 768) {
            $sidebar.removeClass('open');
            $sidebar.css('transform', '');
        }
    });
    jQuery(document).ready(function ($) {

        // Acordeón para dropdowns de nav

        // Desactivar acordeón nativo de BS
        $('.bd-vertical-nav-list .dropdown-toggle').removeAttr('data-bs-toggle');

        // JS para acordeón propio
        $('.bd-vertical-nav-list .dropdown-toggle').on('click', function (e) {
            e.preventDefault();

            var $parentLi = $(this).parent('.dropdown');
            var $submenu = $parentLi.find('.dropdown-menu');
            var isOpening = !$parentLi.hasClass('show');
            // Cerrar otros submenus abiertos
            var $otherDropdowns = $('.bd-vertical-nav-list .dropdown.show').not($parentLi);
            if ($otherDropdowns.length) {
                $otherDropdowns.removeClass('show');
                $otherDropdowns.find('.dropdown-toggle').removeClass('show');

                anime({
                    targets: $otherDropdowns.find('.dropdown-menu')[0],
                    maxHeight: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
            // Abrir o cerrar el submenu clickeado
            if (isOpening) {
                $parentLi.addClass('show');
                $(this).addClass('show');
                // Cálculo de altura para submenu con animejs
                var targetHeight = $submenu[0].scrollHeight;
                anime({
                    targets: $submenu[0],
                    maxHeight: targetHeight,
                    duration: 350,
                    easing: 'easeOutCubic',
                    complete: function () {
                        // si hay submenus abiertos se quita el límite
                        $submenu.css('max-height', 'none');
                    }
                });
            } else {
                $parentLi.removeClass('show');
                $(this).removeClass('show');

                anime({
                    targets: $submenu[0],
                    maxHeight: 0,
                    duration: 300,
                    easing: 'easeInCubic'
                });
            }
        });

    });
})(jQuery);