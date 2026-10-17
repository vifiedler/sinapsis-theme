//estoy segur que ya existia??? but aqui esta de nuevo xd
// ah, creo que era el de musica

(function ($) {
    'use strict';

    function initDragAndDrop() {
        if ($('.tarjeta-libreria').length > 0) {
            if ($('.tarjeta-libreria').hasClass('ui-draggable')) {
                $('.tarjeta-libreria').draggable('destroy');
            }
            
            $('.tarjeta-libreria').draggable({
                helper: 'clone',
                revert: 'invalid',
                cursor: 'move',
                appendTo: 'body',
                zIndex: 9999
            });
        }
        if ($('#zona-favoritos').length > 0) {
            if ($('#zona-favoritos').hasClass('ui-droppable')) {
                $('#zona-favoritos').droppable('destroy');
            }

            $('#zona-favoritos').droppable({
                accept: '.tarjeta-libreria',
                hoverClass: 'favoritos-hover',
                drop: function(event, ui) {
                    var $zona = $(this);
                    var $tarjeta = ui.draggable;
                    
                    var id = $tarjeta.data('id') || $tarjeta.attr('id');
                    var nombre = $tarjeta.data('nombre') || $tarjeta.find('h3').text().trim() || 'Librería';

                    if (!id) return;

                    if ($zona.find('[data-id="' + id + '"]').length > 0) {
                        return; 
                    }

                    var $nuevoFavorito = $('<div class="favorito-item" data-id="' + id + '">' + nombre + '</div>');
                    $zona.append($nuevoFavorito);
                    
               
                    $zona.find('.texto-vacio').hide(); 

               
                    bdGuardarFavorito(id, nombre);
                }
            });
        }

        bdCargarFavoritos();
    }

    function bdGuardarFavorito(id, nombre) {
        var favoritos = JSON.parse(localStorage.getItem('bd_mis_favoritos')) || [];
        if (!favoritos.some(fav => fav.id === id)) {
            favoritos.push({ id: id, nombre: nombre });
            localStorage.setItem('bd_mis_favoritos', JSON.stringify(favoritos));
        }
    }

    function bdCargarFavoritos() {
        var favoritos = JSON.parse(localStorage.getItem('bd_mis_favoritos')) || [];
        var $zona = $('#zona-favoritos');
        
        if (favoritos.length > 0 && $zona.length > 0) {
            $zona.find('.texto-vacio').hide(); 
            favoritos.forEach(function(fav) {
                if ($zona.find('[data-id="' + fav.id + '"]').length === 0) {
                    var $item = $('<div class="favorito-item" data-id="' + fav.id + '">' + fav.nombre + '</div>');
                    $zona.append($item);
                }
            });
        }
    }

    $(document).ready(function() {
        initDragAndDrop();
    });

    $(document).ajaxComplete(function() {
        initDragAndDrop();
    });

})(jQuery);