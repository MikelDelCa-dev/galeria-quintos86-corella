let todosLosElementos = [];
let elementosFiltrados = []; // Guarda el resultado de los filtros antes de recortar por página
let eventoSeleccionado = "Todos";
let tipoSeleccionado = "todos";
let textoBusqueda = ""; 

// 🎛️ CONFIGURACIÓN DE LA PAGINACIÓN
let paginaActual = 1;
const ELEMENTOS_POR_PAGINA = 12; // Modifica a 15 si prefieres más adelante

fetch('contenido.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        todosLosElementos = datos;
        crearBotonesDeEventos();
        aplicarFiltrosCombinados();
    })
    .catch(error => console.error("Error cargando el JSON:", error));

function crearBotonesDeEventos() {
    const contenedorEventos = document.getElementById('contenedor-eventos');
    contenedorEventos.innerHTML = ""; 

    const eventos = ['Todos', ...new Set(todosLosElementos.map(item => item.evento))];

    eventos.forEach((evento, index) => {
        const boton = document.createElement('button');
        boton.className = 'btn';
        if (index === 0) boton.classList.add('activo');
        boton.innerText = evento;
        
        boton.onclick = () => {
            document.querySelectorAll('#contenedor-eventos .btn').forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');
            eventoSeleccionado = evento;
            paginaActual = 1; // Al cambiar de evento, volvemos a la página 1
            aplicarFiltrosCombinados();
        };
        
        contenedorEventos.appendChild(boton);
    });
}

function cambiarTipo(tipo, botonPresionado) {
    document.querySelectorAll('#contenedor-tipos .btn').forEach(b => b.classList.remove('activo'));
    botonPresionado.classList.add('activo');
    tipoSeleccionado = tipo;
    paginaActual = 1; // Al cambiar el tipo, volvemos a la página 1
    aplicarFiltrosCombinados();
}

function filtrarPorTexto() {
    const inputBuscador = document.getElementById('buscador');
    textoBusqueda = inputBuscador.value.toLowerCase().trim(); 
    paginaActual = 1; // Al buscar, volvemos a la página 1
    aplicarFiltrosCombinados(); 
}

function limpiarTexto(texto) {
    if (!texto) return "";
    return texto.toString().replace(/[“”""'']/g, '').trim().toLowerCase();
}

function aplicarFiltrosCombinados() {
    let resultado = todosLosElementos;

    if (eventoSeleccionado !== "Todos") {
        resultado = resultado.filter(item => item.evento === eventoSeleccionado);
    }

    if (tipoSeleccionado !== "todos") {
        resultado = resultado.filter(item => item.tipo === tipoSeleccionado);
    }

    if (textoBusqueda !== "") {
        resultado = resultado.filter(item => {
            const tituloLimpio = limpiarTexto(item.titulo);
            return tituloLimpio.includes(textoBusqueda);
        });
    }

    elementosFiltrados = resultado; // Guardamos la lista filtrada completa
    actualizarPaginacionYGaleria(); // Llama al motor de cortes y páginas
}

// 🎛️ MOTOR DE LA PAGINACIÓN: Calcula y recorta la lista
function actualizarPaginacionYGaleria() {
    const totalElementos = elementosFiltrados.length;
    const totalPaginas = Math.ceil(totalElementos / ELEMENTOS_POR_PAGINA);

    // Calcular el índice de inicio y fin para el recorte (.slice)
    const inicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
    const fin = inicio + ELEMENTOS_POR_PAGINA;
    
    // Lista final recortada (máximo 12 elementos)
    const listaPagina = elementosFiltrados.slice(inicio, fin);

    // Pintar la galería con los 12 elementos cortados
    mostrarElementos(listaPagina);

    // Crear y actualizar la botonera de páginas abajo
    dibujarBotonesPaginacion(totalPaginas);
}

// 🎛️ DIBUJAR BOTONES DE PÁGINA (Anterior, Números, Siguiente)
function dibujarBotonesPaginacion(totalPaginas) {
    const contenedorPag = document.getElementById('contenedor-paginacion');
    contenedorPag.innerHTML = ""; // Limpiar botones viejos

    if (totalPaginas <= 1) return; // Si no hay suficientes fotos para hacer 2 páginas, no dibuja botones

    // Botón Anterior ◀️
    const btnAnt = document.createElement('button');
    btnAnt.className = 'btn-pag';
    btnAnt.innerText = "◀️";
    btnAnt.disabled = paginaActual === 1;
    btnAnt.onclick = () => { paginaActual--; actualizarPaginacionYGaleria(); window.scrollTo({top: 0, behavior: 'smooth'}); };
    contenedorPag.appendChild(btnAnt);

    // Botones Numéricos (1, 2, 3...)
    for (let i = 1; i <= totalPaginas; i++) {
        const btnNum = document.createElement('button');
        btnNum.className = 'btn-pag';
        if (i === paginaActual) btnNum.classList.add('activo');
        btnNum.innerText = i;
        btnNum.onclick = () => { paginaActual = i; actualizarPaginacionYGaleria(); window.scrollTo({top: 0, behavior: 'smooth'}); };
        contenedorPag.appendChild(btnNum);
    }

    // Botón Siguiente ▶️
    const btnSig = document.createElement('button');
    btnSig.className = 'btn-pag';
    btnSig.innerText = "▶️";
    btnSig.disabled = paginaActual === totalPaginas;
    btnSig.onclick = () => { paginaActual++; actualizarPaginacionYGaleria(); window.scrollTo({top: 0, behavior: 'smooth'}); };
    contenedorPag.appendChild(btnSig);
}

function mostrarElementos(lista) {
    const contenedor = document.getElementById('galeria-multimedia');
    contenedor.innerHTML = ""; 

    if (lista.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; color: #aaa; padding: 40px; font-size: 16px;">🔍 No se encontraron elementos que coincidan con tu búsqueda.</p>`;
        return;
    }

    lista.forEach(elemento => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';

        const tituloPantalla = elemento.titulo ? elemento.titulo.toString().replace(/[“”]/g, '') : 'Sin título';

        if (elemento.tipo === 'foto') {
            tarjeta.innerHTML = `
                <div class="media-contenedor">
                    <img src="${elemento.url}" alt="${tituloPantalla}" onclick="abrirVisor('${elemento.url}', 'foto')">
                </div>
                <h3>${tituloPantalla}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        } else if (elemento.tipo === 'video') {
            tarjeta.innerHTML = `
                <div class="media-contenedor" style="background: #111;">
                    <button class="btn-play-video" onclick="abrirVisor('${elemento.url}', 'video')">🎬 Ver Video</button>
                </div>
                <h3>${tituloPantalla}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        }

        contenedor.appendChild(tarjeta);
    });
}

function abrirVisor(url, tipo) {
    const lightbox = document.getElementById('miLightbox');
    const cajaLightbox = document.getElementById('cajaLightbox');
    cajaLightbox.innerHTML = "";
    
    if (tipo === 'foto') {
        cajaLightbox.innerHTML = `<img src="${url}" class="lightbox-contenido">`;
    } else if (tipo === 'video') {
        cajaLightbox.innerHTML = `<iframe src="${url}" allow="autoplay" style="width:100%; height:100%; border-radius:8px;"></iframe>`;
    }
    
    lightbox.style.display = 'flex';
}

function cerrarVisor() {
    const lightbox = document.getElementById('miLightbox');
    const cajaLightbox = document.getElementById('cajaLightbox');
    lightbox.style.display = 'none';
    cajaLightbox.innerHTML = ""; 
}


