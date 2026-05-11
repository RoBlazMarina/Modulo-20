let remainingTime = 0;
let initialDuration = 0;
let interval = null;
let isPaused = false;
let maze = {
    playerX: 0,
    playerY: 0,
    goalX: 0,
    goalY: 0,
    size: 300,
    radius: 5,
    map: [
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

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function startStudy() {
    startTimer(25 * 60, "Study Time");
}

function startBreak() {
    startTimer(5 * 60, "Break Time");
}

function startTimer(seconds, title) {
    initialDuration = seconds;
    remainingTime = seconds;
    isPaused = false;
    document.getElementById("pause-button").textContent = "Pause";
    document.getElementById("timer-title").textContent = title;
    updateTimerDisplay();
    showScreen("timer-screen");

    if (interval) clearInterval(interval);

    interval = setInterval(() => {
        if (!isPaused) {
            remainingTime--;
            updateTimerDisplay();

            if (remainingTime <= 0) {
                clearInterval(interval);
                document.getElementById("alarm").play();
                alert("¡Time finished!");
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    let min = Math.floor(remainingTime / 60);
    let sec = remainingTime % 60;
    document.getElementById("time").textContent =
        `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function pauseRestart() {
    isPaused = !isPaused;
    document.getElementById("pause-button").textContent = isPaused ? "Resume" : "Pause";
}

function restart() {
    clearInterval(interval);
    startTimer(initialDuration, document.getElementById("timer-title").textContent);
}

function goToHome() {
    clearInterval(interval);
    showScreen("home-screen");
}

function showSubscription() {
    showScreen("subscription-screen");
}

function startMaze() {
    showScreen("maze-screen");
    const rows = maze.map.length;
    const cols = maze.map[0].length;
    
    // Find initial position (o)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze.map[i][j] === 'o') {
                maze.playerX = (j + 0.5) * (300 / cols);
                maze.playerY = (i + 0.5) * (300 / rows);
            }
        }
    }
    drawMaze();
    document.addEventListener('mousemove', moveInMaze);
}

function drawMaze() {
    const canvas = document.getElementById("maze-canvas");
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#f5fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const rows = maze.map.length;
    const cols = maze.map[0].length;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    
    ctx.fillStyle = "#2a7aaa";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze.map[i][j] === '*') {
                ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            }
        }
    }
    
    // Goal (W)
    ctx.fillStyle = "#d9542f";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze.map[i][j] === 'W') {
                maze.goalX = j * cellWidth + cellWidth / 2;
                maze.goalY = i * cellHeight + cellHeight / 2;
                ctx.beginPath();
                ctx.arc(maze.goalX, maze.goalY, cellWidth / 2 - 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Player (o)
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(maze.playerX, maze.playerY, cellWidth / 3, 0, Math.PI * 2);
    ctx.fill();
}

function moveInMaze(e) {
    const canvas = document.getElementById("maze-canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rows = maze.map.length;
    const cols = maze.map[0].length;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    const radius = cellWidth / 3;
    
    const dx = x - maze.playerX;
    const dy = y - maze.playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const speed = 2;
    let newX = maze.playerX;
    let newY = maze.playerY;
    
    if (distance > speed) {
        newX += (dx / distance) * speed;
        newY += (dy / distance) * speed;
    }
    
    // Check collision with walls
    const colJ = Math.floor(newX / cellWidth);
    const rowI = Math.floor(newY / cellHeight);
    
    if (rowI >= 0 && rowI < rows && colJ >= 0 && colJ < cols && maze.map[rowI][colJ] !== '*') {
        maze.playerX = newX;
        maze.playerY = newY;
    }
    
    drawMaze();
    
    // Check if reached the goal
    const distanceToGoal = Math.sqrt(
        Math.pow(maze.playerX - maze.goalX, 2) + 
        Math.pow(maze.playerY - maze.goalY, 2)
    );
    
    if (distanceToGoal < 20) {
        document.removeEventListener('mousemove', moveInMaze);
        showCat();
    }
}

function showCat() {
    showScreen("cat-screen");
}
