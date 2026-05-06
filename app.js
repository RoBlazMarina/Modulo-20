let tiempoRestante = 0;
let intervalo = null;
let enPausa = false;

function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
}

function iniciarEstudio() {
    iniciarTemporizador(25 * 60, "Tiempo de estudio");
}

function iniciarDescanso() {
    iniciarTemporizador(5 * 60, "Tiempo de descanso");
}

function iniciarTemporizador(segundos, titulo) {
    tiempoRestante = segundos;
    document.getElementById("titulo-temporizador").textContent = titulo;
    actualizarPantallaTiempo();
    mostrarPantalla("pantalla-temporizador");

    if (intervalo) clearInterval(intervalo);

    intervalo = setInterval(() => {
        if (!enPausa) {
            tiempoRestante--;
            actualizarPantallaTiempo();

            if (tiempoRestante <= 0) {
                clearInterval(intervalo);
                document.getElementById("alarma").play();
                alert("¡Tiempo terminado!");
            }
        }
    }, 1000);
}

function actualizarPantallaTiempo() {
    let min = Math.floor(tiempoRestante / 60);
    let seg = tiempoRestante % 60;
    document.getElementById("tiempo").textContent =
        `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

function pausarReanudar() {
    enPausa = !enPausa;
    document.getElementById("btn-pausa").textContent = enPausa ? "Reanudar" : "Pausar";
}

function reiniciar() {
    clearInterval(intervalo);
    iniciarTemporizador(tiempoRestante, document.getElementById("titulo-temporizador").textContent);
}

function volverInicio() {
    clearInterval(intervalo);
    mostrarPantalla("pantalla-inicio");
}

function mostrarSuscripcion() {
    mostrarPantalla("pantalla-suscripcion");
}

function mostrarGato() {
    document.getElementById("gato").classList.remove("oculto");
}
