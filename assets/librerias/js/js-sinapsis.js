//estoy segur que ya existia??? but aqui esta de nuevo xd
// ah, creo que era el de musica

document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('tarjeta-libreria')) {
        var id = e.target.getAttribute('data-id') || e.target.getAttribute('id');
        var nombre = e.target.getAttribute('data-nombre') || e.target.querySelector('h3')?.innerText || 'Librería';
        e.dataTransfer.setData('text/plain', JSON.stringify({ id: id, nombre: nombre }));
        e.dataTransfer.effectAllowed = 'copy';
    }
});

document.addEventListener('dragover', function(e) {
    var zona = e.target.closest('#zona-favoritos');
    if (zona) {
        e.preventDefault();
        zona.classList.add('favoritos-hover');
    }
});

document.addEventListener('dragleave', function(e) {
    var zona = e.target.closest('#zona-favoritos');
    if (zona) {
        zona.classList.remove('favoritos-hover');
    }
});

document.addEventListener('drop', function(e) {
    var zona = e.target.closest('#zona-favoritos');
    if (zona) {
        e.preventDefault();
        zona.classList.remove('favoritos-hover');
        
        var dataString = e.dataTransfer.getData('text/plain');
        if (!dataString) return;

        try {
            var data = JSON.parse(dataString);
            if (!data.id || !data.nombre) return;
            if (zona.querySelector('[data-id="' + data.id + '"]')) return;

            var nuevoFavorito = document.createElement('div');
            nuevoFavorito.className = 'favorito-item';
            nuevoFavorito.setAttribute('data-id', data.id);
            nuevoFavorito.innerText = data.nombre;
            zona.appendChild(nuevoFavorito);

            var textoVacio = zona.querySelector('.texto-vacio');
            if (textoVacio) textoVacio.style.display = 'none';

            var favoritos = JSON.parse(localStorage.getItem('bd_mis_favoritos')) || [];
            if (!favoritos.some(function(f) { return f.id === data.id; })) {
                favoritos.push({ id: data.id, nombre: data.nombre });
                localStorage.setItem('bd_mis_favoritos', JSON.stringify(favoritos));
            }
        } catch (err) {}
    }
});

function activarTarjetas() {
    var tarjetas = document.querySelectorAll('.tarjeta-libreria');
    tarjetas.forEach(function(t) {
        t.setAttribute('draggable', 'true');
    });

    var zona = document.getElementById('zona-favoritos');
    if (zona) {
        var favoritos = JSON.parse(localStorage.getItem('bd_mis_favoritos')) || [];
        if (favoritos.length > 0) {
            var textoVacio = zona.querySelector('.texto-vacio');
            if (textoVacio) textoVacio.style.display = 'none';
            
            favoritos.forEach(function(f) {
                if (!zona.querySelector('[data-id="' + f.id + '"]')) {
                    var el = document.createElement('div');
                    el.className = 'favorito-item';
                    el.setAttribute('data-id', f.id);
                    el.innerText = f.nombre;
                    zona.appendChild(el);
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', activarTarjetas);
new MutationObserver(activarTarjetas).observe(document.body, { childList: true, subtree: true });