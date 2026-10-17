//estoy segur que ya existia??? but aqui esta de nuevo xd
// ah, creo que era el de musica

document.addEventListener('dragstart', function(e) {
    var caja = e.target.closest('.library-card');
    if (caja) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: caja.getAttribute('data-id'),
            nombre: caja.getAttribute('data-nombre')
        }));
        e.dataTransfer.effectAllowed = 'copy';
        caja.style.opacity = '0.5';
    }
});

document.addEventListener('dragend', function(e) {
    var caja = e.target.closest('.library-card');
    if (caja) {
        caja.style.opacity = '1';
    }
});

document.addEventListener('dragover', function(e) {
    var zona = e.target.closest('#zona-favoritos');
    if (zona) {
        e.preventDefault();
        zona.style.borderColor = '#dc3545';
        zona.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
    }
});

document.addEventListener('dragleave', function(e) {
    var zona = e.target.closest('#zona-favoritos');
    if (zona) {
        zona.style.borderColor = '';
        zona.style.backgroundColor = '';
    }
});

document.addEventListener('drop', function(e) {
    var zona = e.target.closest('#zona-favoritos');
    if (zona) {
        e.preventDefault();
        zona.style.borderColor = '';
        zona.style.backgroundColor = '';
        
        var dataString = e.dataTransfer.getData('text/plain');
        if (!dataString) return;

        try {
            var data = JSON.parse(dataString);
            if (!data.id || !data.nombre) return;
            if (zona.querySelector('[data-id="' + data.id + '"]')) return;

            var nuevo = document.createElement('div');
            nuevo.className = 'favorito-item';
            nuevo.setAttribute('data-id', data.id);
            nuevo.innerText = data.nombre;
            zona.appendChild(nuevo);

            var textosVacios = zona.querySelectorAll('.texto-vacio');
            textosVacios.forEach(function(t) { t.style.display = 'none'; });

            var favoritos = JSON.parse(localStorage.getItem('bd_favoritos')) || [];
            if (!favoritos.some(function(f) { return f.id === data.id; })) {
                favoritos.push({ id: data.id, nombre: data.nombre });
                localStorage.setItem('bd_favoritos', JSON.stringify(favoritos));
            }
        } catch (err) {}
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var zona = document.getElementById('zona-favoritos');
    if (zona) {
        var favoritos = JSON.parse(localStorage.getItem('bd_favoritos')) || [];
        if (favoritos.length > 0) {
            var textosVacios = zona.querySelectorAll('.texto-vacio');
            textosVacios.forEach(function(t) { t.style.display = 'none'; });
            
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
});