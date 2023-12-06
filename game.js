document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    // ... (Rest of your initializations)

    function touchMoveHandler(e) {
        e.preventDefault(); // Prevent scrolling when touching the canvas
        let touchX = e.touches[0].clientX;
        paddleX = touchX - paddleWidth / 2;

        // Ensure the paddle doesn't move beyond the canvas boundaries
        if (paddleX < 0) {
            paddleX = 0;
        } else if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }

    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });

    // ... (Rest of your game logic)

    // Replace the brick color logic with the appropriate colors from your image
    // You might need to preprocess your image to determine these colors
    function drawBricks() {
        // Example of setting brick colors
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD"; // Set this to the color of the corresponding image pixel
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // ... (Rest of your game logic)

    draw();
});
