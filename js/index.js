/* VARIABLES Y COMPONENTES */
const $buttonCafecitoDelDiaVolver = document.querySelector('#buttonCafecitoDelDiaVolver');

let buttonsNavegacion = [];

let secciones = [];

let buttonsVolver = [];

let ultimaPantalla = 'sectionMain';

let productos = [];

let productosSeleccionados = [];

const cliente = {
    nombre: '',
    entrega: '',
    oficina: '',
    fechaDeEntrega: '',
    horaDeEntrega: '',
    totalAPagar: 0,
    puntosDeSabiduria: 0,
};



/* FUNCIONES */
const recuperarBotonesDeNavegacion = () => {
    buttonsNavegacion = document.querySelectorAll('[data-modal]');
}

const recuperarSecciones = () => {
    secciones = document.querySelectorAll('.windowFloat');
}

const agregarEventoABotonesNavegacion = () => {
    buttonsNavegacion.forEach( (button) => {
        button.addEventListener('click', (e) => {

            const seccionAMostrarID = e.currentTarget.getAttribute('data-modal');

            if(seccionAMostrarID !== 'sectionCafecitoDelDia') ultimaPantalla = seccionAMostrarID;

            secciones.forEach( (seccion) => {
                if(seccion.id === seccionAMostrarID) seccion.classList.add('showWindowFloat');
                else seccion.classList.remove('showWindowFloat');
            });
        });
    });
}

const mostrarLaUltimaPantalla = () => {
    secciones.forEach( seccion => {
        if(seccion.id === ultimaPantalla) seccion.classList.add('showWindowFloat');
        else seccion.classList.remove('showWindowFloat');
    });
}

const consumirAPIFraseDelDia = async () => {
    const URL = 'https://www.positive-api.online/phrase/esp'
    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error al obtener la frase del día:', error);
        return 'La frase del dia se fue de sabatico cariño :(';
    }
}

const renderizarFraseDelDia = async () => {
    const fraseGuardada = obtenerFraseDelDiaDeLocalStorage();
    const fechaActual = new Date().toDateString();
    
    if(fraseGuardada && fraseGuardada.fecha === fechaActual) {
        document.querySelector('#fraseDelDia').textContent = fraseGuardada.frase;
        return;
    }

    const fraseDelDia = await consumirAPIFraseDelDia();
    guardarFraseDelDiaEnLocalStorage(fraseDelDia);
    document.querySelector('#fraseDelDia').textContent = fraseDelDia;
    incrementarPuntosDeSabiduria();
}

const guardarFraseDelDiaEnLocalStorage = (frase) => {
    localStorage.setItem('fraseDelDia', JSON.stringify({frase, fecha: new Date().toDateString()}));
}

const obtenerFraseDelDiaDeLocalStorage = () => {
    return JSON.parse(localStorage.getItem('fraseDelDia'));
}

const renderizarPuntosDeSabiduria = () => {
    const puntosDeSabiduria = cliente.puntosDeSabiduria;
    document.querySelector('#puntosDeSabiduria').textContent = puntosDeSabiduria;
}

const incrementarPuntosDeSabiduria = () => {
    cliente.puntosDeSabiduria++;
    renderizarPuntosDeSabiduria();
}

const recuperarProductos = async () => {
    const respuesta = await fetch('./data/productos.json');
    const data = await respuesta.json();
    productos = data;
}

const renderizarProductos = async () => {
    await recuperarProductos();

    const $containerMenu = document.querySelector('#containerMenu'); 

    productos.forEach( producto => {
        const $producto = /* html */
        `<article class="menu_producto" onclick="seleccionarProducto(event, ${producto.id})">
            <h2 class="producto_nombre">${producto.nombre}</h2>
            <p class="producto_precio">$${producto.precio}</p>
            <div class="menu_ContainerFlex">
                <img class="menu_img" src="./img/Salad_PrimerDiaDeClases.svg" alt="">
                <p class="menu_description">${producto.descripcion}</p>
            </div>
            <div class="producto_botonera">
            <button class="producto_buttonCantidad clickable" onclick="cambiarCantidadProducto(event, ${producto.id}, 'decrementar')">-</button>
            <p class="producto_cantidadText" id="cantidadProducto${producto.id}">1</p>
            <button class="producto_buttonCantidad clickable" onclick="cambiarCantidadProducto(event, ${producto.id}, 'incrementar')">+</button>
            </div>
         </article>`;

         $containerMenu.innerHTML += $producto;
    }); 
}

const seleccionarProducto = (e, idProducto) => {
    const productoYaSeleccionado = productosSeleccionados.find( producto => producto.id === idProducto );

    if(productoYaSeleccionado) {
        //Eliminar Producto 
        productosSeleccionados = productosSeleccionados.filter( producto => producto.id !== idProducto );
        e.currentTarget.classList.remove('menu_productoSeleccionado');
        return;
    }

    const productoSeleccionado = productos.find( producto => producto.id === idProducto );
    productoSeleccionado.cantidad = 1;
    document.querySelector(`#cantidadProducto${idProducto}`).textContent = productoSeleccionado.cantidad;
    e.currentTarget.classList.add('menu_productoSeleccionado');

    productosSeleccionados.push(productoSeleccionado);
}

const cambiarCantidadProducto = (e, idProducto, operacion) => {
    e.stopPropagation();
    const producto = productosSeleccionados.find( producto => producto.id === idProducto );
    if(operacion === 'incrementar') producto.cantidad++;
    else 
        if(producto.cantidad > 1) producto.cantidad--;

    document.querySelector(`#cantidadProducto${idProducto}`).textContent = producto.cantidad;
}

/* EVENTOS */
document.addEventListener('DOMContentLoaded', async ()  => {
    
    recuperarBotonesDeNavegacion();
    
    recuperarSecciones();

    agregarEventoABotonesNavegacion();

    await renderizarProductos();

    renderizarFraseDelDia();

    renderizarPuntosDeSabiduria();
});

$buttonCafecitoDelDiaVolver.addEventListener('click', mostrarLaUltimaPantalla);