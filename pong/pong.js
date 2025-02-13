document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  // Images
  const paddleImg = new Image();
  paddleImg.src = "../2025/img/logga-olcupen.png"; // Replace with your paddle image

  const ballImg = new Image();
  ballImg.src = "../2025/img/logga-olcupen.png"; // Replace with your ball image

  // Game objects
  const paddleWidth = 30, paddleHeight = 100;
  const ballSize = 30;
  let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  let ballX = canvas.width / 2, ballY = canvas.height / 2;
  let ballSpeedX = 5, ballSpeedY = 3;

  function update() {
      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Move paddles up and down
      ballSpeedX < 0 ? leftPaddleY = ballY-50 : leftPaddleY = canvas.height / 2 - paddleHeight / 2;
      ballSpeedX > 0 ? rightPaddleY = ballY-50 : rightPaddleY = canvas.height / 2 - paddleHeight / 2;


      // Bounce off top and bottom
      if (ballY <= 0 || ballY + ballSize >= canvas.height) {
          ballSpeedY *= -1;
      }

      // Bounce off paddles
      if (
          (ballX <= paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
          (ballX + ballSize >= canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
      ) {
          ballSpeedX *= -1;
      }

      // Reset if ball goes off screen
      if (ballX < 0 || ballX > canvas.width) {
          ballX = canvas.width / 2;
          ballY = canvas.height / 2;
          ballSpeedX *= -1;
      }
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.drawImage(paddleImg, 0, leftPaddleY, paddleWidth, paddleHeight);
      ctx.drawImage(paddleImg, canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

      // Draw ball
      ctx.drawImage(ballImg, ballX, ballY, ballSize, ballSize);
  }

  function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
