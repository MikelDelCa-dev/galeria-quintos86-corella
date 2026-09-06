let todosLosElementos = [];
let eventoSeleccionado = "Todos";
let tipoSeleccionado = "todos";

// 1. Cargar el archivo JSON automáticamente al abrir la página
fetch('contenido.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        todosLosElementos = datos;
        crearBotonesDeEventos();
        aplicarFiltrosCombinados();
    })
    .catch(error => console.error("Error cargando el JSON:", error));

// 2. Función para crear dinámicamente los botones de eventos
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

// 3. Función que se ejecuta al pulsar Fotos, Videos o Todo
function cambiarTipo(tipo, botonPresionado) {
    document.querySelectorAll('#contenedor-tipos .btn').forEach(b => b.classList.remove('activo'));
    botonPresionado.classList.add('activo');
    tipoSeleccionado = tipo;
    aplicarFiltrosCombinados();
}

// 4. El motor del cruce de datos
function aplicarFiltrosCombinados() {
    let resultado = todosLosElementos;

    if (eventoSeleccionado !== "Todos") {
        resultado = resultado.filter(item => item.evento === eventoSeleccionado);
    }

    if (tipoSeleccionado !== "todos") {
        resultado = resultado.filter(item => item.tipo === tipoSeleccionado);
    }

    mostrarElementos(resultado);
}

// 5. Función para pintar los elementos finales en pantalla
function mostrarElementos(lista) {
    const contenedor = document.getElementById('galeria-multimedia');
    contenedor.innerHTML = ""; 

    lista.forEach(elemento => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';

        if (elemento.tipo === 'foto') {
            tarjeta.innerHTML = `
                <div class="media-contenedor">
                    <img src="${elemento.url}" alt="${elemento.titulo}" onclick="abrirVisor('${elemento.url}', 'foto')">
                </div>
                <h3>${elemento.titulo}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        } else if (elemento.tipo === 'video') {
            tarjeta.innerHTML = `
                <div class="media-contenedor">
                    <button class="btn-expandir-video" onclick="abrirVisor('${elemento.url}', 'video')">🔎 Expandir</button>
                    <iframe src="${elemento.url}" allow="autoplay"></iframe>
                </div>
                <h3>${elemento.titulo}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        }

        contenedor.appendChild(tarjeta);
    });
}

// 👁️ VISOR INTELIGENTE UNIVERSAL PARA IMÁGENES Y VIDEOS
function abrirVisor(url, tipo) {
    const lightbox = document.getElementById('miLightbox');
    const cajaLightbox = document.getElementById('cajaLightbox');
    
    cajaLightbox.innerHTML = "";
    
    if (tipo === 'foto') {
        cajaLightbox.innerHTML = `<img src="${url}" class="lightbox-contenido">`;
    } else if (tipo === 'video') {
        cajaLightbox.innerHTML = `<iframe src="${url}" allow="autoplay"></iframe>`;
    }
    
    lightbox.style.display = 'flex';
}

function cerrarVisor() {
    const lightbox = document.getElementById('miLightbox');
    const cajaLightbox = document.getElementById('cajaLightbox');
    
    lightbox.style.display = 'none';
    cajaLightbox.innerHTML = ""; 
}
