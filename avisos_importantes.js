// ===== REFERENCIAS A LOS ELEMENTOS DEL HTML =====
const avisos = document.querySelectorAll('.aviso');          // los tres avisos
const pendientes = document.getElementById('pendientes');    // contador de pendientes
const btnRestablecer = document.getElementById('btnRestablecer');
// ===== CLAVE DE LOCALSTORAGE =====
const CLAVE = 'avisos_estado';
// ===== LEER EL ESTADO GUARDADO =====
// Devuelve un objeto con los datos de cada aviso, por ejemplo:
// { aviso1: { prioridad: 'urgente', texto: '...', leido: true } }
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        return guardado ? JSON.parse(guardado) : {};
    } catch (error) {
      return {}; // si algo falla, empezamos desde cero
    }
}
// ===== GUARDAR EL ESTADO ACTUAL =====
// Recorre los avisos, toma lo que hay en pantalla y lo guarda
function guardarEstado() {
    const estado = {};
    avisos.forEach(aviso => {
        estado[aviso.dataset.id] = {
            prioridad: aviso.querySelector('.prioridad').value,
            texto: aviso.querySelector('textarea').value,
            leido: aviso.classList.contains('leido')
        };
    });
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// ===== ACTUALIZAR EL ASPECTO DE UN AVISO =====
// Cambia el color de la franja, la clase "leido" y el texto del botón
function pintarAviso(aviso, prioridad, leido) {
    aviso.dataset.prioridad = prioridad;      // el CSS usa este atributo para el color
    aviso.classList.toggle('leido', leido);   // agrega o quita la clase "leido"
    aviso.querySelector('[data-leido]').textContent =
        leido ? 'Marcar como no leído' : 'Marcar como leído';
}
// ===== CONTAR LOS AVISOS PENDIENTES =====
function actualizarContador() {
    const sinLeer = document.querySelectorAll('.aviso:not(.leido)').length;
    pendientes.textContent = sinLeer;
}
// ===== RESTAURAR LOS DATOS GUARDADOS EN PANTALLA =====
function cargarEstado() {
    const estado = leerEstado();
    avisos.forEach(aviso => {
        const datos = estado[aviso.dataset.id];
        if (!datos) {
            // Aviso sin datos guardados: solo ajustamos el botón y el color
            pintarAviso(aviso, aviso.dataset.prioridad, false);
            return;
        }
        // Devolvemos a los campos lo que estaba guardado
        aviso.querySelector('.prioridad').value = datos.prioridad;
        aviso.querySelector('textarea').value = datos.texto;
        pintarAviso(aviso, datos.prioridad, datos.leido);
    });
    actualizarContador();
}
// ===== EVENTOS =====
// Al pulsar "Marcar como leído" en cualquier aviso
document.addEventListener('click', evento => {
    const boton = evento.target.closest('[data-leido]');
    if (!boton) return;
    const aviso = boton.closest('.aviso');
    const prioridad = aviso.querySelector('.prioridad').value;
    const estaLeido = aviso.classList.contains('leido');
    pintarAviso(aviso, prioridad, !estaLeido);  // invertimos el estado
    guardarEstado();
    actualizarContador();
});
// Al cambiar la prioridad con el selector
document.addEventListener('change', evento => {
    if (!evento.target.matches('.prioridad')) return;
    const aviso = evento.target.closest('.aviso');
    pintarAviso(aviso, evento.target.value, aviso.classList.contains('leido'));
    guardarEstado();
});
// Al escribir en el mensaje, se guarda al instante
document.addEventListener('input', evento => {
    if (evento.target.matches('textarea')) guardarEstado();
});
// Botón restablecer: borra lo guardado y recarga la página
btnRestablecer.addEventListener('click', () => {
    if (!confirm('¿Quieres volver a los avisos originales?')) return;
    localStorage.removeItem(CLAVE);
    location.reload();
});
// ===== INICIO: se ejecuta al cargar o refrescar la página =====
cargarEstado();