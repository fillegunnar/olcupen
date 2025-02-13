const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const player1Img = new Image();
player1Img.src = '../2025/img/logga-olcupen.png'; // Replace with the path to your player 1 image

const player2Img = new Image();
player2Img.src = '../2025/img/logga-olcupen.png'; // Replace with the path to your player 2 image

const ballImg = new Image();
ballImg.src = '../2025/img/logga-olcupen.png'; // Replace with the path to your ball image

// Game objects
const playerWidth = 50, playerHeight = 50;
const ballSize = 30;

const player1 = { x: 50, y: canvas.height / 2 - playerHeight / 2, speed: 5 };
const player2 = { x: canvas.width - 50 - playerWidth, y: canvas.height / 2 - playerHeight / 2, speed: 5 };
const ball = { x: canvas.width / 2 - ballSize / 2, y: canvas.height / 2 - ballSize / 2, speedX: 4, speedY: 4 };

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game objects
function update() {
    // Player 1 movement (W/S keys)
    if (keys['w'] && player1.y > 0) {
        player1.y -= player1.speed;
    }
    if (keys['s'] && player1.y < canvas.height - playerHeight) {
        player1.y += player1.speed;
    }

    // Player 2 movement (Up/Down arrow keys)
    if (keys['ArrowUp'] && player2.y > 0) {
        player2.y -= player2.speed;
    }
    if (keys['ArrowDown'] && player2.y < canvas.height - playerHeight) {
        player2.y += player2.speed;
    }

    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.speedY *= -1;
    }

    // Ball collision with players
    if (
        (ball.x <= player1.x + playerWidth && ball.y + ballSize >= player1.y && ball.y <= player1.y + playerHeight) ||
        (ball.x + ballSize >= player2.x && ball.y + ballSize >= player2.y && ball.y <= player2.y + playerHeight)
    ) {
        ball.speedX *= -1;
    }

    // Ball out of bounds (goal scored)
    if (ball.x < 0 || ball.x > canvas.width) {
        // Reset ball position
        ball.x = canvas.width / 2 - ballSize / 2;
        ball.y = canvas.height / 2 - ballSize / 2;
        ball.speedX *= -1;
    }
}

// Draw game objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw players
    ctx.drawImage(player1Img, player1.x, player1.y, playerWidth, playerHeight);
    ctx.drawImage(player2Img, player2.x, player2.y, playerWidth, playerHeight);

    // Draw ball
    ctx.drawImage(ballImg, ball.x, ball.y, ballSize, ballSize);
}

// Start the game
gameLoop();
