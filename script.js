let snake = [];
let snakeSize = 20;
let food;
let foodImage;
let xSpeed = snakeSize;
let ySpeed = 0;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('game-container');
    frameRate(10);
    let startPos = createVector(floor(width / 2), floor(height / 2));
    snake.push(startPos);
    foodLocation();

    // Image upload listener
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            foodImage = loadImage(URL.createObjectURL(e.target.files[0]));
        }
    });

    // Mobile controls
    document.getElementById('up').addEventListener('click', () => changeDirection(0, -1));
    document.getElementById('down').addEventListener('click', () => changeDirection(0, 1));
    document.getElementById('left').addEventListener('click', () => changeDirection(-1, 0));
    document.getElementById('right').addEventListener('click', () => changeDirection(1, 0));
}

function draw() {
    background(220);
    if (gameOver()) {
        textSize(32);
        fill(0);
        text("Game Over", width / 4, height / 2);
        noLoop(); // Stop the game
        return;
    }

    if (foodImage) {
        image(foodImage, food.x, food.y, snakeSize, snakeSize);
    } else {
        fill(255, 0, 0);
        rect(food.x, food.y, snakeSize, snakeSize);
    }

    moveSnake();
    drawSnake();
}

function keyPressed() {
    if (keyCode === UP_ARROW) changeDirection(0, -1);
    if (keyCode === DOWN_ARROW) changeDirection(0, 1);
    if (keyCode === LEFT_ARROW) changeDirection(-1, 0);
    if (keyCode === RIGHT_ARROW) changeDirection(1, 0);
}

function changeDirection(x, y) {
    if (xSpeed !== -x * snakeSize) xSpeed = x * snakeSize;
    if (ySpeed !== -y * snakeSize) ySpeed = y * snakeSize;
}

function moveSnake() {
    let head = snake[0].copy();
    head.x += xSpeed;
    head.y += ySpeed;
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        foodLocation(); // Create new food
    } else {
        snake.pop(); // Remove tail
    }
}

function drawSnake() {
    fill(0);
    for (let part of snake) {
        rect(part.x, part.y, snakeSize, snakeSize);
    }
}

function foodLocation() {
    let cols = floor(width / snakeSize);
    let rows = floor(height / snakeSize);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(snakeSize);
}

function gameOver() {
    let head = snake[0];
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}
