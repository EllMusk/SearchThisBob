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

        // Boundary checks
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y > canvas.height || player.y < 0) gameOver();
    }

    function drawPlayer() {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function generatePlatforms() {
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

    function drawPlatforms() {
        ctx.fillStyle = 'blue';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    function findHighestPlatform(platforms) {
        let highestPlatform = platforms.reduce((highest, platform) => {
            return platform.y < highest.y ? platform : highest;
        }, { y: canvas.height });
        return highestPlatform.y - player.height * 2; // Start above the highest platform
    }

    function handlePlatformMovement() {
        platforms.forEach(platform => {
            platform.y += 2; // Move platforms down to simulate jumping up
            if (platform.y > canvas.height) {
                let index = platforms.indexOf(platform);
                platforms.splice(index, 1);
                addNewPlatformAtTop();
            }
        });
    }

    function addNewPlatformAtTop() {
        let platformWidth = Math.random() * (canvas.width / 2) + 50;
        let platformHeight = 20;
        let x = Math.random() * (canvas.width - platformWidth);
        let y = platforms.length > 0 ? platforms[0].y - 100 : 50;
        platforms.unshift({ x, y, width: platformWidth, height: platformHeight });
    }

    function handleCollisions() {
        platforms.forEach(platform => {
            if (player.y + player.height > platform.y &&
                player.y + player.height < platform.y + platform.height &&
                player.x + player.width > platform.x &&
                player.x < platform.x + platform.width &&
                player.dy > 0) {
                player.dy = -10; // Jumping effect
            }
        });
    }

    function updateScore() {
        score++;
        document.getElementById('score').innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = highScore;
        }
    }

    function gameOver() {
        gameRunning = false;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('gameOver').onclick = restartGame;
    }

    function restartGame() {
        platforms = [];
        player.x = canvas.width / 2;
        player.y = findHighestPlatform(platforms);
        player.dy = 0;
        score = 0;
        document.getElementById('score').innerText = score;
        document.getElementById('gameOver').style.display = 'none';
        gameRunning = true;
        gameLoop();
    }

    function handleTilt(event) {
        tilt = event.gamma; // Assuming gamma is the left/right tilt in degrees
        // Normalize the tilt value between -1 and 1
        tilt = tilt / 45;
    }

    setup();
    gameLoop();
});
