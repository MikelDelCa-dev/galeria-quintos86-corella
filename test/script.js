let todosLosElementos = [];
let eventoSeleccionado = "Todos";
let tipoSeleccionado = "todos";
let textoBusqueda = ""; 

// 1. Cargar el archivo JSON automáticamente al abrir la página
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
            aplicarFiltrosCombinados();
        };
        
        contenedorEventos.appendChild(boton);
    });
}

function cambiarTipo(tipo, botonPresionado) {
    document.querySelectorAll('#contenedor-tipos .btn').forEach(b => b.classList.remove('activo'));
    botonPresionado.classList.add('activo');
    tipoSeleccionado = tipo;
    aplicarFiltrosCombinados();
}

function filtrarPorTexto() {
    const inputBuscador = document.getElementById('buscador');
    textoBusqueda = inputBuscador.value.toLowerCase().trim(); 
    aplicarFiltrosCombinados(); 
}

// 🧽 FUNCIÓN AUXILIAR: Borra las comillas curvas si se colaron en el JSON
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

    // 🔍 BUSCADOR OPTIMIZADO: Compara limpiando cualquier tipo de comillas
    if (textoBusqueda !== "") {
        resultado = resultado.filter(item => {
            const tituloLimpio = limpiarTexto(item.titulo);
            return tituloLimpio.includes(textoBusqueda);
        });
    }

    mostrarElementos(resultado);
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

        // Al mostrar el título en la web, también le quitamos las comillas raras de las esquinas
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
                <div class="media-contenedor">
                    <button class="btn-expandir-video" onclick="abrirVisor('${elemento.url}', 'video')">🔎 Expandir</button>
                    <iframe src="${elemento.url}" allow="autoplay"></iframe>
                </div>
                <h3>${tituloPantalla}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        }

        contenedor.appendChild(tarjeta);
    });
}

// 👁️ VISOR CORREGIDO: Evita el solapamiento de videos
function abrirVisor(url, tipo) {
    const lightbox = document.getElementById('miLightbox');
    const cajaLightbox = document.getElementById('cajaLightbox');
    
    cajaLightbox.innerHTML = "";
    
    if (tipo === 'foto') {
        cajaLightbox.innerHTML = `<img src="${url}" class="lightbox-contenido">`;
    } else if (tipo === 'video') {
        // 1. Ocultamos temporalmente todos los videos que están de fondo en la galería
        document.querySelectorAll('.media-contenedor iframe').forEach(iframe => {
            iframe.style.visibility = 'hidden';
        });
        
        // 2. Cargamos el video únicamente dentro del visor de pantalla completa
        cajaLightbox.innerHTML = `<iframe src="${url}" allow="autoplay" style="width:100%; height:100%;"></iframe>`;
    }
    
    lightbox.style.display = 'flex';
}

function cerrarVisor() {
    const lightbox = document.getElementById('miLightbox');
    const cajaLightbox = document.getElementById('cajaLightbox');
    
    lightbox.style.display = 'none';
    cajaLightbox.innerHTML = ""; // Vacía el visor para destruir el video de pantalla completa
    
    // 3. Volvemos a hacer visibles los videos de fondo de la galería
    document.querySelectorAll('.media-contenedor iframe').forEach(iframe => {
        iframe.style.visibility = 'visible';
    });
}

