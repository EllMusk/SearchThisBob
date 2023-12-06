document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const titleScreen = document.getElementById('titleScreen');

    startButton.addEventListener('click', () => {
        titleScreen.hidden = true; // Hide the title screen
        startButton.hidden = true; // Hide the start button
        window.startGame();
    });
});
