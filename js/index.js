/* VARIABLES Y COMPONENTES */
const $buttonCafecitoDelDiaVolver = document.querySelector('#buttonCafecitoDelDiaVolver');

const $lugarEntregaCliente = document.querySelector('#lugarEntregaCliente');

let buttonsNavegacion = [];

let secciones = [];

let buttonsVolver = [];

let ultimaPantalla = 'sectionMain';

let productos = [];

let productosSeleccionados = [];

let totalAPagar = 0;

let cliente = {
    nombre: '',
    edificio: '',
    oficina: '',
    salon: '',
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


/* CAFECITO */
const consumirAPIFraseDelDia = async () => {
    const URL = 'https://www.positive-api.online/phrase/esp'
    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data.text;
    } catch (error) {
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
    guardarPuntosDeSabiduriaEnLocalStorage();
}

const guardarPuntosDeSabiduriaEnLocalStorage = () => {
    localStorage.setItem('puntosDeSabiduria', cliente.puntosDeSabiduria);
}

const recuperarPuntosDeSabiduriaDeLocalStorage = () => {
    const puntos = localStorage.getItem('puntosDeSabiduria');
    if(puntos) cliente.puntosDeSabiduria = parseInt(puntos);
    renderizarPuntosDeSabiduria();
}


/* MENU */
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

const crearID = () => {
    return Date.now();
}

const renderizarPedidos = () => {
    const $containerPedido = document.querySelector('#containerPedido');
    $containerPedido.innerHTML = '';

    totalAPagar = 0;

    productosSeleccionados.forEach( producto => {
        for(let i = 0; i < producto.cantidad; i++) {
            const {id, nombre, precio, ingredientes, imagen} = producto;
    
            const tagsIngredientes = ingredientes.map(ing => `<p class="tags">${ing} ✔</p>`).join("");
    
            totalAPagar += producto.precio;
    
            const $productoEnElPedido = /* html */
            `<article class="detallesPerdido_cardProducto">
                    <img class="detallesPedido_img" src="./img/Salad_PrimerDiaDeClases.svg" alt="">
                        
                    <p class="producto_nombre">${nombre}</p>
                    <p class="producto_precio">$${precio}</p>
                    <div class="detallePedido_containerTags">
                        ${tagsIngredientes}
                    </div>
        
        
                    <p class="detallePedido_frase">“Aprobado por estómagos universitarios.”</p>
                </article>`;
    
            $containerPedido.innerHTML += $productoEnElPedido;


        }
    });
}

const eliminarPedido = (idProducto) => {
    const indexProducto = productosSeleccionados.findIndex( producto => producto.id === idProducto );
    console.log(indexProducto);

    productosSeleccionados[indexProducto].cantidad--;

    if(productosSeleccionados[indexProducto].cantidad === 0) {
        productosSeleccionados.splice(indexProducto, 1);
    }

    renderizarPedidos();
}


/* DATOS USUARIO */
const recuperarDatosDelUsuario = () => {

    cliente.nombre = document.querySelector('#nombreCliente').value || '';
    cliente.entrega = document.querySelector('#lugarEntregaCliente').value || '';
    cliente.oficina = document.querySelector('#numeroOficinaCliente').value || '';
    cliente.horaDeEntrega = document.querySelector('#horaEntregaCliente').value || '';
    cliente.edificio = document.querySelector('#edificioCliente').value || document.querySelector('#edificioSalonCliente').value || '';
    cliente.salon = document.querySelector('#numeroSalonCliente').value || '';

    renderizarResumenDelPedido();
}

const resetFormularioDatosDelUsuario = () => {
    document.querySelector('#nombreCliente').value = '';
    document.querySelector('#lugarEntregaCliente').value = '';
    document.querySelector('#numeroOficinaCliente').value = '';
    document.querySelector('#horaEntregaCliente').value = '';
    document.querySelector('#edificioCliente').value = '';
    document.querySelector('#numeroSalonCliente').value = '';
    document.querySelector('#edificioSalonCliente').value = '';
}

const mostrarPreguntasOcultas = () => {
    resetPreguntasOcultas();

    const $containerQuestionOficina = document.querySelector('#containerQuestionOficina');
    if($lugarEntregaCliente.value === 'Oficina') {
        $containerQuestionOficina.classList.remove('preguntasOcultas');
    } else {
        $containerQuestionOficina.classList.add('preguntasOcultas');
    }

    const $containerQuestionSalon = document.querySelector('#containerQuestionSalon');
    if($lugarEntregaCliente.value === 'Salon') {
        $containerQuestionSalon.classList.remove('preguntasOcultas');
    } else {
        $containerQuestionSalon.classList.add('preguntasOcultas');
    }
}

const resetPreguntasOcultas = () => {
    cliente.oficina = '';
    cliente.salon = '';

    document.querySelector('#numeroOficinaCliente').value = '';
    document.querySelector('#edificioCliente').value = '';

    document.querySelector('#numeroSalonCliente').value = '';
    document.querySelector('#edificioSalonCliente').value = '';
}

/* RESUMEN PEDIDO */

const renderizarDatosDelUsarioEnResumen = () => {
    const {nombre, edificio, oficina, salon, horaDeEntrega} = cliente;
    const $resumenInfoUsuario = document.querySelector('#resumenInfoUsuario');

    if(salon == '' && oficina == '') $resumenInfoUsuario.textContent = `¡Hola, ${nombre}! Su pedido será entregado hoy a las ${horaDeEntrega} en la puerta de el edificio ${edificio}. El total de su pedido es de ${totalAPagar} MXN.¡Gracias por su preferencia!`;

    if(oficina) $resumenInfoUsuario.textContent = `¡Hola, ${nombre}! Su pedido será entregado hoy a las ${horaDeEntrega} en su oficina que es la ${oficina} en el edificio ${edificio}. El total de su pedido es de ${totalAPagar} MXN.¡Gracias por su preferencia!`;

    if(salon) $resumenInfoUsuario.textContent = `¡Hola, ${nombre}! Su pedido será entregado hoy a las ${horaDeEntrega} en su el salón ${salon} que esta en el edificio ${edificio}. El total de su pedido es de ${totalAPagar} MXN.¡Gracias por su preferencia!`;

}

const renderizarTotalAPagar = () => {
    const $totalAPagar = document.querySelector('#totalAPagar');
    $totalAPagar.textContent = `$${totalAPagar}`;
}

const renderizarResumenDelPedido = () => {

    renderizarDatosDelUsarioEnResumen();
    
    renderizarPedidos();

    renderizarTotalAPagar();
}




/* EVENTOS */
document.addEventListener('DOMContentLoaded', async ()  => {
    
    recuperarBotonesDeNavegacion();
    
    recuperarSecciones();

    agregarEventoABotonesNavegacion();

    await renderizarProductos();

    renderizarFraseDelDia();

    recuperarPuntosDeSabiduriaDeLocalStorage();
});

$buttonCafecitoDelDiaVolver.addEventListener('click', mostrarLaUltimaPantalla);

$lugarEntregaCliente.addEventListener('change', mostrarPreguntasOcultas);