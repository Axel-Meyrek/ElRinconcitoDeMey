/* VARIABLES Y COMPONENTES */
const $buttonCafecitoDelDiaVolver = document.querySelector('#buttonCafecitoDelDiaVolver');

let buttonsNavegacion = [];

let secciones = [];

let buttonsVolver = [];

let ultimaPantalla = 'sectionMain';






/* FUNCIONES */
const recuperarBotonesDeNavegacion = () => buttonsNavegacion = document.querySelectorAll('[data-modal]');

const recuperarSecciones = () => secciones = document.querySelectorAll('.windowFloat');

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







/* EVENTOS */
document.addEventListener('DOMContentLoaded', () => {
    
    recuperarBotonesDeNavegacion();
    
    recuperarSecciones();

    agregarEventoABotonesNavegacion();

});

$buttonCafecitoDelDiaVolver.addEventListener('click', () => {
    secciones.forEach( seccion => {
        if(seccion.id === ultimaPantalla) seccion.classList.add('showWindowFloat');
        else seccion.classList.remove('showWindowFloat');
    });
});