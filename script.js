
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameRunning = true;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let platforms = [];
    let player = { x: canvas.width / 2, y: canvas.height / 2, width: 50, height: 50, dy: 0 };
    let tilt = 0;

    function setup() {
        platforms = generatePlatforms();
        player.y = findHighestPlatform(platforms);
        document.getElementById('highScore').innerText = highScore;

        window.addEventListener('deviceorientation', handleTilt, true);
    }

    function gameLoop() {
        if (!gameRunning) return;
        
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    function update() {
        handlePlayerMovement();
        handlePlatformMovement();
        handleCollisions();
        updateScore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawPlatforms();
    }

    function handlePlayerMovement() {
        player.dy += 0.5; // Gravity effect
        player.y += player.dy;
        player.x += tilt * 0.5; // Horizontal movement based on tilt

        if (player.y > canvas.height || player.y < 0) {
            gameOver();
        }
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Additional functions like generatePlatforms, handleCollisions, etc.

    function handleTilt(event) {
        tilt = event.gamma; // Assuming gamma is the left/right tilt
    }

    setup();
    gameLoop();
});
