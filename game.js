document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;

    let ball = new Image();
    ball.src = 'path_to_your_character_head_image.png';
    let ballSize = 30;

    let ballX = canvas.width / 2 - ballSize / 2;
    let ballY = canvas.height / 2 - ballSize / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    let paddleWidth = 10;
    let paddleHeight = 100;
    let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
    let aiPaddleY = canvas.height / 2 - paddleHeight / 2;

    function drawBall() {
        if (ball.complete) {
            ctx.drawImage(ball, ballX, ballY, ballSize, ballSize);
        }
    }

    function drawPaddle(x, y) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(x, y, paddleWidth, paddleHeight);
    }

    function updateGame() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY < 0 || ballY > canvas.height - ballSize) {
            ballSpeedY *= -1;
        }

        if (ballX < paddleWidth && ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight ||
            ballX > canvas.width - paddleWidth - ballSize && ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
            ballSpeedX *= -1;
        }

        aiPaddleY = ballY - paddleHeight / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle(0, playerPaddleY);
        drawPaddle(canvas.width - paddleWidth, aiPaddleY);

        requestAnimationFrame(updateGame);
    }

    updateGame();

    canvas.addEventListener('mousemove', (event) => {
        playerPaddleY = event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
    });
});
