
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Game variables
let player, platforms, score, gravity, isGameOver;

// Player properties
const playerSize = 30;
const jumpHeight = 15;

// Initialize game elements
function init() {
    player = { x: width / 2, y: height - playerSize * 2, dy: 0 };
    platforms = [];
    score = 0;
    gravity = 0.5;
    isGameOver = false;
    generatePlatforms();
    gameLoop();
}

// Generate platforms
function generatePlatforms() {
    const platformCount = Math.floor(height / 100);
    for (let i = 0; i < platformCount; i++) {
        let platform = {
            x: Math.random() * (width - 60),
            y: height - i * 100,
            width: 60,
            height: 10
        };
        platforms.push(platform);
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    if (!isGameOver) {
        updatePlayer();
        updatePlatforms();
        checkCollision();
        drawPlayer();
        drawPlatforms();
        requestAnimationFrame(gameLoop);
    } else {
        displayGameOver();
    }
}

// Update player position
function updatePlayer() {
    player.dy += gravity;
    player.y += player.dy;

    // Jump logic
    if (player.y <= height / 2) {
        platforms.forEach(p => {
            p.y -= player.dy;
            if (p.y > height) {
                p.y = 0;
                p.x = Math.random() * (width - p.width);
                score++;
            }
        });
    }

    // Game over condition
    if (player.y > height || player.y + playerSize < 0) {
        isGameOver = true;
    }
}

// Update platforms
function updatePlatforms() {
    platforms.forEach(p => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

// Check collision with platforms
function checkCollision() {
    platforms.forEach(p => {
        if (player.x < p.x + p.width &&
            player.x + playerSize > p.x &&
            player.y < p.y + p.height &&
            player.y + playerSize > p.y) {
            player.dy = -jumpHeight;
        }
    });
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(player.x, player.y, playerSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Draw platforms
function drawPlatforms() {
    platforms.forEach(p => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

// Display game over message
function displayGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', width / 2, height / 2);
    ctx.fillText('Score: ' + score, width / 2, height / 2 + 40);
}

// Touch controls
canvas.addEventListener('touchstart', function(e) {
    player.x = e.touches[0].clientX;
});

// Initialize game
init();
