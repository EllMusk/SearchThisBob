document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameRunning = true;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let platforms = [];
    let player = { x: canvas.width / 2, y: canvas.height / 2, width: 50, height: 50, dy: 0, dx: 0 };
    let touching = false;

    function setup() {
        platforms = generatePlatforms();
        player.y = findHighestPlatform(platforms);
        document.getElementById('highScore').innerText = highScore;

        canvas.addEventListener('touchstart', handleTouchStart, false);
        canvas.addEventListener('touchend', handleTouchEnd, false);
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
        if (touching) {
            player.x += player.dx;
        }

        // Boundary checks
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y > canvas.height || player.y < 0) gameOver();
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // ... Other functions like generatePlatforms, handleCollisions, etc.

    function handleTouchStart(event) {
        touching = true;
        // Determine direction based on touch position
        const touchX = event.touches[0].clientX;
        player.dx = touchX < canvas.width / 2 ? -5 : 5;
    }

    function handleTouchEnd(event) {
        touching = false;
        player.dx = 0;
    }

    setup();
    gameLoop();
});
