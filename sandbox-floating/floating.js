document.addEventListener("DOMContentLoaded", function () {
  const numImages = 7; // Number of floating images
  const container = document.body; // Background container

  for (let i = 0; i < numImages; i++) {
      let img = document.createElement("img");
      img.src = "../2025/img/logga-olcupen.png"; // Replace with your image URL
      img.classList.add("floating-image");

      // Random starting position
      let randomX = Math.random() * window.innerWidth;
      let randomY = Math.random() * window.innerHeight;
      img.style.left = `${randomX}px`;
      img.style.top = `${randomY}px`;

      // Random animation duration and delay
      let duration = Math.random() * 5 + 5; // Between 5s and 10s
      let delay = Math.random() * 3; // Delay up to 3s
      img.style.setProperty("--animation-duration", `${duration}s`);
      img.style.setProperty("--animation-delay", `${delay}s`);

      container.appendChild(img);
  }
});
