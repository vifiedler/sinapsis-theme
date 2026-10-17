//estoy segur que ya existia??? but aqui esta de nuevo xd
// ah, creo que era el de musica

document.addEventListener('DOMContentLoaded', function() {

    function inicializarDragAndDrop() {
        const tarjetas = document.querySelectorAll('.tarjeta-libreria');
        const zona = document.getElementById('zona-favoritos');

        if (tarjetas.length === 0 || !zona) return;

        tarjetas.forEach(tarjeta => {
            tarjeta.setAttribute('draggable', 'true');
            
      
            if (tarjeta.dataset.dragReady) return;
            tarjeta.dataset.dragReady = "true";

            tarjeta.addEventListener('dragstart', function(e) {
                const id = this.getAttribute('data-id') || this.getAttribute('id') || 'item-' + Math.random();
                const nombre = this.getAttribute('data-nombre') || this.querySelector('h3')?.innerText || 'Librería';
                
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: id, nombre: nombre }));
                e.dataTransfer.effectAllowed = 'copy';
                this.style.opacity = '0.5';
            });

            tarjeta.addEventListener('dragend', function() {
                this.style.opacity = '1';
            });
        });

        if (!zona.dataset.dropReady) {
            zona.dataset.dropReady = "true";

            zona.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('favoritos-hover');
            });

            zona.addEventListener('dragleave', function() {
                this.classList.remove('favoritos-hover');
            });

            zona.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('favoritos-hover');

                const dataString = e.dataTransfer.getData('text/plain');
                if (!dataString) return;

                try {
                    const data = JSON.parse(dataString);
                    
        
                    if (this.querySelector(`[data-id="${data.id}"]`)) return; 

             
                    const nuevoFavorito = document.createElement('div');
                    nuevoFavorito.className = 'favorito-item';
                    nuevoFavorito.setAttribute('data-id', data.id);
                    nuevoFavorito.innerText = data.nombre;
                    this.appendChild(nuevoFavorito);

                    const textoVacio = this.querySelector('.texto-vacio');
                    if (textoVacio) textoVacio.style.display = 'none';

                    guardarFavorito(data.id, data.nombre);
                } catch (err) {
                    console.error("Error al soltar:", err);
                }
            });
        }

        cargarFavoritos();
    }

    function guardarFavorito(id, nombre) {
        let favoritos = JSON.parse(localStorage.getItem('bd_mis_favoritos')) || [];
        if (!favoritos.some(fav => fav.id === id)) {
            favoritos.push({ id: id, nombre: nombre });
            localStorage.setItem('bd_mis_favoritos', JSON.stringify(favoritos));
        }
    }

    function cargarFavoritos() {
        let favoritos = JSON.parse(localStorage.getItem('bd_mis_favoritos')) || [];
        const zona = document.getElementById('zona-favoritos');
        
        if (favoritos.length > 0 && zona) {
            const textoVacio = zona.querySelector('.texto-vacio');
            if (textoVacio) textoVacio.style.display = 'none'; 
            
            favoritos.forEach(fav => {
                if (!zona.querySelector(`[data-id="${fav.id}"]`)) {
                    const item = document.createElement('div');
                    item.className = 'favorito-item';
                    item.setAttribute('data-id', fav.id);
                    item.innerText = fav.nombre;
                    zona.appendChild(item);
                }
            });
        }
    }

    inicializarDragAndDrop();

    
    const observer = new MutationObserver(function(mutations) {
        inicializarDragAndDrop();
    });
    

    const contenedorPrincipal = document.getElementById('bd-content') || document.body;
    observer.observe(contenedorPrincipal, { childList: true, subtree: true });
    
});