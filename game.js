document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ... [Rest of the initializations]

    function touchMoveHandler(e) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            var touchX = touch.pageX;

            paddleX = touchX - paddleWidth / 2;
            if (paddleX < 0) {
                paddleX = 0;
            } else if (paddleX + paddleWidth > canvas.width) {
                paddleX = canvas.width - paddleWidth;
            }
        }
    }

    canvas.addEventListener("touchmove", touchMoveHandler, false);

    // ... [Rest of your game logic]

    draw();
});
