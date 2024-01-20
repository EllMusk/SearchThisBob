let canvas, ctx, scale, rows, columns;
let snake, fruit, score;
let gameInterval;
let fruitImage = new Image();
fruitImage.src = 'path/to/your/fruit-image.png';  // Replace with the path to your fruit image

document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scale = 20;
    rows = canvas.height / scale;
    columns = canvas.width / scale;
    document.getElementById('startMenu').style.display = 'flex';
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "red";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        if (this.total >= 1) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    this.changeDirection = function(direction) {
        switch (direction) {
            case 'Up':
                this.xSpeed = 0;
                this.ySpeed = -scale * 1;
                break;
            case 'Down':
                this.xSpeed = 0;
                this.ySpeed = scale * 1;
                break;
            case 'Left':
                this.xSpeed = -scale * 1;
                this.ySpeed = 0;
                break;
            case 'Right':
                this.xSpeed = scale * 1;
                this.ySpeed = 0;
                break;
        }
    };

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            score++;
            increaseSpeed();
            return true;
        }
        return false;
    };

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    };
}

function Fruit() {
    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    };

    this.draw = function() {
        ctx.drawImage(fruitImage, this.x, this.y, scale, scale);
    };
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
        fruit.pickLocation();
    }

    if (snake.checkCollision()) {
        gameOver();
    }
}

function increaseSpeed() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, Math.max(100, 250 - (score * 10)));
}

function startGame() {
    document.getElementById('startMenu').style.display = 'none';
    canvas.style.display = 'block';
    score = 0;
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 250);
}

function gameOver() {
    clearInterval(gameInterval);
    document.getElementById('gameOver').style.display = 'flex';
    canvas.style.display = 'none';
}

function saveScore() {
    const name = document.getElementById('playerName').value;
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    showLeaderboard();
}

function showLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardDiv.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach(entry => {
        leaderboardDiv.innerHTML += `<p>${entry.name}: ${entry.score}</p>`;
    });
    leaderboardDiv.innerHTML += '<button class="button" onclick="backToMainMenu()">Back to Main Menu</button>';
    leaderboardDiv.style.display = 'block';
}

function backToMainMenu() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
}

window.addEventListener('keydown', e => {
    const direction = e.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

let touchStartX, touchStartY;
canvas.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    e.preventDefault();
});

canvas.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const xDiff = touchStartX - touchEndX;
    const yDiff = touchStartY - touchEndY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            snake.changeDirection('Left');
        } else {
            snake.changeDirection('Right');
        }
    } else {
        if (yDiff > 0) {
            snake.changeDirection('Up');
        } else {
            snake.changeDirection('Down');
        }
    }
    e.preventDefault();
});
