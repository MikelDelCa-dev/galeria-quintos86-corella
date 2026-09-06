let todosLosElementos = [];

// 1. Cargar el archivo JSON automáticamente al abrir la página
fetch('contenido.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        todosLosElementos = datos;
        mostrarElementos(todosLosElementos); // Muestra todo al principio
    });

// 2. Función para pintar las fotos y videos en la pantalla
function mostrarElementos(lista) {
    const contenedor = document.getElementById('galeria-multimedia');
    contenedor.innerHTML = ""; // Limpiar la pantalla antes de pintar

    lista.forEach(elemento => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';

        // Si es foto, crea una etiqueta <img>. Si es video, crea una <video>
        if (elemento.tipo === 'foto') {
            tarjeta.innerHTML = `
                <img src="${elemento.url}" alt="${elemento.titulo}">
                <h3>${elemento.titulo}</h3>
            `;
        } else if (elemento.tipo === 'video') {
            tarjeta.innerHTML = `
                <video src="${elemento.url}" controls></video>
                <h3>${elemento.titulo}</h3>
            `;
        }

        contenedor.appendChild(tarjeta);
    });
}

// 3. Función para filtrar por Foto o Video cuando presionas los botones
function filtrarGaleria(tipo) {
    if (tipo === 'todos') {
        mostrarElementos(todosLosElementos);
    } else {
        const filtrados = todosLosElementos.filter(item => item.tipo === tipo);
        mostrarElementos(filtrados);
    }
}
