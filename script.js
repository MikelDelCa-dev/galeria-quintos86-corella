let todosLosElementos = [];
let eventoSeleccionado = "Todos";
let tipoSeleccionado = "todos";

// 1. Cargar el archivo JSON automáticamente al abrir la página
fetch('contenido.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        todosLosElementos = datos;
        crearBotonesDeEventos(); // Genera la fila de eventos automáticamente
        aplicarFiltrosCombinados(); // Muestra todo al principio
    });

// 2. Función para crear dinámicamente los botones de eventos
function crearBotonesDeEventos() {
    const contenedorEventos = document.getElementById('contenedor-eventos');
    contenedorEventos.innerHTML = ""; 

    // Obtener lista de eventos únicos
    const eventos = ['Todos', ...new Set(todosLosElementos.map(item => item.evento))];

    eventos.forEach((evento, index) => {
        const boton = document.createElement('button');
        boton.className = 'btn';
        if (index === 0) boton.classList.add('activo'); // "Todos" empieza activo
        boton.innerText = evento;
        
        boton.onclick = () => {
            // Cambiar clase activa visualmente en la fila de eventos
            document.querySelectorAll('#contenedor-eventos .btn').forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');
            
            // Actualizar el evento seleccionado y aplicar filtros
            eventoSeleccionado = evento;
            aplicarFiltrosCombinados();
        };
        
        contenedorEventos.appendChild(boton);
    });
}

// 3. Función que se ejecuta al pulsar Fotos, Videos o Todo
function cambiarTipo(tipo, botonPresionado) {
    // Cambiar clase activa visualmente en la fila de tipos
    document.querySelectorAll('#contenedor-tipos .btn').forEach(b => b.classList.remove('activo'));
    botonPresionado.classList.add('activo');

    // Actualizar el tipo seleccionado y aplicar filtros
    tipoSeleccionado = tipo;
    aplicarFiltrosCombinados();
}

// 4. El motor del cruce de datos: Filtra por Evento Y por Tipo al mismo tiempo
function aplicarFiltrosCombinados() {
    let resultado = todosLosElementos;

    // Primer filtro: Evento
    if (eventoSeleccionado !== "Todos") {
        resultado = resultado.filter(item => item.evento === eventoSeleccionado);
    }

    // Segundo filtro: Tipo (foto o video)
    if (tipoSeleccionado !== "todos") {
        resultado = resultado.filter(item => item.tipo === tipoSeleccionado);
    }

    // Dibujar el resultado final en la pantalla
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
                    <img src="${elemento.url}" alt="${elemento.titulo}">
                </div>
                <h3>${elemento.titulo}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        } else if (elemento.tipo === 'video') {
            tarjeta.innerHTML = `
                <div class="media-contenedor">
                    <iframe src="${elemento.url}" allow="autoplay"></iframe>
                </div>
                <h3>${elemento.titulo}</h3>
                <span class="etiqueta">${elemento.evento}</span>
            `;
        }

        contenedor.appendChild(tarjeta);
    });

}
