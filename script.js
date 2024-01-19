const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let player, platforms, score, gravity, isGameOver, movingRight, movingLeft;

const playerSize = 30;
const jumpHeight = 15;
const playerMoveSpeed = 5;

function init() {
    player = { x: width / 2, y: height - playerSize * 2, dy: 0 };
    platforms = [];
    score = 0;
    gravity = 0.5;
    isGameOver = false;
    movingRight = false;
    movingLeft = false;
    generatePlatforms();
    platforms[0] = { x: player.x - 30, y: height - 20, width: 60, height: 10 }; 
    gameLoop();
}

function generatePlatforms() {
    const platformCount = Math.floor(height / 100) + 1;
    for (let i = 0; i < platformCount; i++) {
        let platform = {
            x: Math.random() * (width - 60),
            y: height - i * 100 - 100,
            width: 60,
            height: 10
        };
        platforms.push(platform);
    }
}

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

function updatePlayer() {
    player.dy += gravity;
    player.y += player.dy;

    if (movingRight) player.x += playerMoveSpeed;
    if (movingLeft) player.x -= playerMoveSpeed;

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

    if (player.y > height || player.y + playerSize < 0) {
        isGameOver = true;
    }
}

function updatePlatforms() {
    platforms.forEach(p => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

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

function drawPlayer() {
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(player.x, player.y, playerSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawPlatforms() {
    platforms.forEach(p => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

function displayGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', width / 2, height / 2);
    ctx.fillText('Score: ' + score, width / 2, height / 2 + 40);
    
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    document.getElementById('restartButton').style.display = 'none';
    init();
}

canvas.addEventListener('touchstart', function(e) {
    if (e.touches[0].clientX < width / 2) {
        movingLeft = true;
    } else {
        movingRight = true;
    }
});

canvas.addEventListener('touchend', function(e) {
    movingLeft = false;
    movingRight = false;
});

document.body.innerHTML += '<button id="restartButton" onclick="restartGame()" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;”>Restart’;