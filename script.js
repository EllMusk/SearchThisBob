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

    function setup() {
        // Initialize platforms and player position
        platforms = generatePlatforms();
        player.y = findHighestPlatform(platforms);
        document.getElementById('highScore').innerText = highScore;

        // Touch Controls
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

    // Player Movement
    function handlePlayerMovement() {
        player.dy += 0.5; // Gravity
        player.y += player.dy;

        if (player.y > canvas.height || player.y < 0) {
            gameOver();
        }
    }

    // Player Drawing
    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Platform Generation
    function generatePlatforms() {
        let platforms = [];
        let platformCount = Math.floor(canvas.height / 100);
        for (let i = 0; i < platformCount; i++) {
            let platformWidth = Math.random() * (canvas.width / 2) + 50;
            let platformHeight = 20;
            let x = Math.random() * (canvas.width - platformWidth);
            let y = canvas.height - (i * 100);
            platforms.push({ x, y, width: platformWidth, height: platformHeight });
        }
        return platforms;
    }

    // Draw Platforms
    function drawPlatforms() {
        ctx.fillStyle = 'blue';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    // Player and Platform Collision
    function handleCollisions() {
        platforms.forEach(platform => {
            if (player.y + player.height > platform.y && 
                player.y < platform.y + platform.height && 
                player.x + player.width > platform.x && 
                player.x < platform.x + platform.width && 
                player.dy > 0) {
                player.dy = -10; // Jumping effect
            }
        });
    }

    // Platform Movement
    function handlePlatformMovement() {
        platforms.forEach(platform => {
            platform.y += 2;
            if (platform.y > canvas.height) {
                let index = platforms.indexOf(platform);
                platforms.splice(index, 1);
                addNewPlatform();
            }
        });
    }

    // Add new platform
    function addNewPlatform() {
        let platformWidth = Math.random() * (canvas.width / 2) + 50;
        let platformHeight = 20;
        let x = Math.random() * (canvas.width - platformWidth);
        let y = 0;
        platforms.push({ x, y, width: platformWidth, height: platformHeight });
    }

    // Find Highest Platform
    function findHighestPlatform(platforms) {
        let highest = canvas.height;
        platforms.forEach(platform => {
            if (platform.y < highest) {
                highest = platform.y;
            }
        });
        return highest - 100; // Start above the highest platform
    }

    // Scoring
    function updateScore() {
        score++;
        document.getElementById('score').innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = highScore;
        }
    }

    // Game Over
    function gameOver() {
        gameRunning = false;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('gameOver').addEventListener('click', restartGame);
    }

    // Restart Game
    function restartGame() {
        score = 0;
        document.getElementById('gameOver').style.display = 'none';
            setup();
    gameRunning = true;
    gameLoop();
}

// Touch Controls
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    if (touchEndX < touchStartX) {
        player.x -= 50; // Move left
    } else if (touchEndX > touchStartX) {
        player.x += 50; // Move right
    }
}

setup();
gameLoop();
