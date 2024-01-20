document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;

    let snake;
    let fruit;
    let score = 0;
    
    function showStartMenu() {
        document.getElementById('startMenu').style.display = 'flex';
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
    }

    function startGame() {
        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        score = 0;
        snake = new Snake();
        fruit = new Fruit();
        fruit.pickLocation();
    }

    function gameOver() {
        document.getElementById('gameOver').style.display = 'flex';
        document.getElementById('gameCanvas').style.display = 'none';
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
        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        leaderboardDiv.style.display = 'block';
    }

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
            switch(direction) {
                case 'Up':
                    if (this.ySpeed === 0) {
                        this.xSpeed = 0;
                        this.ySpeed = -scale * 1;
                    }
                    break;
                case 'Down':
                    if (this.ySpeed === 0) {
                        this.xSpeed = 0;
                        this.ySpeed = scale * 1;
                    }
                    break;
                case 'Left':
                    if (this.xSpeed === 0) {
                        this.xSpeed = -scale * 1;
                        this.ySpeed = 0;
                    }
                    break;
                case 'Right':
                    if (this.xSpeed === 0) {
                        this.xSpeed = scale * 1;
                        this.ySpeed = 0;
                    }
                    break;
            }
        };

        this.eat = function(fruit) {
            if (this.x === fruit.x && this.y === fruit.y) {
                this.total++;
                score++;
                return true;
            }
            return false;
        };

        this.checkCollision = function() {
            for (var i = 0; i < this.tail.length; i++) {
                if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                    this.total = 0;
                    this.tail = [];
                    gameOver();
                }
            }
        }
    }

    function Fruit() {
        this.x;
        this.y;

        this.pickLocation = function() {
            this.x = (Math.floor(Math.random() * columns) + 1) * scale;
            this.y = (Math.floor(Math.random() * rows) + 1) * scale;
        }

        this.draw = function() {
            ctx.fillStyle = "#4cafab";
            ctx.fillRect(this.x, this.y, scale, scale);
        }
    }

    // Game loop
    window.setInterval(() => {
        if (document.getElementById('gameCanvas').style.display === 'block') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fruit.draw();
            snake.update();
            snake.draw();

            if (snake.eat(fruit)) {
                fruit.pickLocation();
            }

            snake.checkCollision();
        }
    }, 250);

    // Touch control implementation
    let touchStartX, touchStartY;
    canvas.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault();
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent scrolling and zoom
    });

    canvas.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const xDiff = touchStartX - touchEndX;
        const yDiff = touchStartY - touchEndY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) { // Horizontal swipe
            if (xDiff > 0) { snake.changeDirection('Left'); } 
            else { snake.changeDirection('Right'); }
        } else { // Vertical swipe
            if (yDiff > 0) { snake.changeDirection('Up'); } 
            else { snake.changeDirection('Down'); }
        }
        e.preventDefault();
    });

    // Show start menu
    showStartMenu();
});
