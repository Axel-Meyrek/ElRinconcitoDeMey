/* VARIABLES Y COMPONENTES */
let buttonsNavegacion = [];

let secciones = [];

let buttonsVolver = [];

let ultimaPantalla;









/* FUNCIONES */
const recuperarBotonesDeNavegacion = () => buttonsNavegacion = document.querySelectorAll('[data-modal]');

const recuperarSecciones = () => secciones = document.querySelectorAll('.windowFloat');

const agregarEventoABotonesNavegacion = () => {
    buttonsNavegacion.forEach( (button) => {
        button.addEventListener('click', (e) => {
            const seccionAMostrarID = e.currentTarget.getAttribute('data-modal');
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