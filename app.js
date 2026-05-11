let tiempoRestante = 0;
let duracionInicial = 0;
let intervalo = null;
let enPausa = false;
let laberinto = {
    jugadorX: 0,
    jugadorY: 0,
    metaX: 0,
    metaY: 0,
    tamaño: 300,
    radio: 5,
    mapa: [
        "******************",
        "*_________*______*",
        "*_*****_____******",
        "*______***__*__*_*",
        "***_*____*____**_*",
        "*___*____**__*___*",
        "*_********__**_*_*",
        "*____*______*__*_*",
        "*_**_*__*****_**_*",
        "*o*__*________**W*",
        "******************"
    ]
};

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
    duracionInicial = segundos;
    tiempoRestante = segundos;
    enPausa = false;
    document.getElementById("btn-pausa").textContent = "Pausar";
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
    iniciarTemporizador(duracionInicial, document.getElementById("titulo-temporizador").textContent);
}

function volverInicio() {
    clearInterval(intervalo);
    mostrarPantalla("pantalla-inicio");
}

function mostrarSuscripcion() {
    mostrarPantalla("pantalla-suscripcion");
}

function iniciarLaberinto() {
    mostrarPantalla("pantalla-laberinto");
    const filas = laberinto.mapa.length;
    const cols = laberinto.mapa[0].length;
    
    // Encontrar posición inicial (o)
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < cols; j++) {
            if (laberinto.mapa[i][j] === 'o') {
                laberinto.jugadorX = (j + 0.5) * (300 / cols);
                laberinto.jugadorY = (i + 0.5) * (300 / filas);
            }
        }
    }
    dibujarLaberinto();
    document.addEventListener('mousemove', moverEnLaberinto);
}

function dibujarLaberinto() {
    const canvas = document.getElementById("laberinto-canvas");
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#f5fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const filas = laberinto.mapa.length;
    const cols = laberinto.mapa[0].length;
    const celW = canvas.width / cols;
    const celH = canvas.height / filas;
    
    ctx.fillStyle = "#2a7aaa";
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < cols; j++) {
            if (laberinto.mapa[i][j] === '*') {
                ctx.fillRect(j * celW, i * celH, celW, celH);
            }
        }
    }
    
    // Meta (W)
    ctx.fillStyle = "#d9542f";
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < cols; j++) {
            if (laberinto.mapa[i][j] === 'W') {
                laberinto.metaX = j * celW + celW / 2;
                laberinto.metaY = i * celH + celH / 2;
                ctx.beginPath();
                ctx.arc(laberinto.metaX, laberinto.metaY, celW / 2 - 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Jugador (o)
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(laberinto.jugadorX, laberinto.jugadorY, celW / 3, 0, Math.PI * 2);
    ctx.fill();
}

function moverEnLaberinto(e) {
    const canvas = document.getElementById("laberinto-canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const filas = laberinto.mapa.length;
    const cols = laberinto.mapa[0].length;
    const celW = canvas.width / cols;
    const celH = canvas.height / filas;
    const radio = celW / 3;
    
    const dx = x - laberinto.jugadorX;
    const dy = y - laberinto.jugadorY;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    
    const velocidad = 2;
    let nuevoX = laberinto.jugadorX;
    let nuevoY = laberinto.jugadorY;
    
    if (distancia > velocidad) {
        nuevoX += (dx / distancia) * velocidad;
        nuevoY += (dy / distancia) * velocidad;
    }
    
    // Verificar colisión con paredes
    const colJ = Math.floor(nuevoX / celW);
    const colI = Math.floor(nuevoY / celH);
    
    if (colI >= 0 && colI < filas && colJ >= 0 && colJ < cols && laberinto.mapa[colI][colJ] !== '*') {
        laberinto.jugadorX = nuevoX;
        laberinto.jugadorY = nuevoY;
    }
    
    dibujarLaberinto();
    
    // Verificar si llegó a la meta
    const distanciaAlFinal = Math.sqrt(
        Math.pow(laberinto.jugadorX - laberinto.metaX, 2) + 
        Math.pow(laberinto.jugadorY - laberinto.metaY, 2)
    );
    
    if (distanciaAlFinal < 20) {
        document.removeEventListener('mousemove', moverEnLaberinto);
        mostrarGato();
    }
}

function mostrarGato() {
    mostrarPantalla("pantalla-gato");
}
