document.addEventListener("DOMContentLoaded", () => {
    const gameBox = document.getElementById("gameBox");
    const result = document.getElementById("result");
    const scoreboard = document.getElementById("scoreboard");
    const muteButton = document.getElementById("muteButton");
  
    const successSound = document.getElementById("successSound");
    const failSound = document.getElementById("failSound");
    const bgMusic = document.getElementById("bgMusic");
  
    let startTime, timeoutID, waiting = false;
    let bestTime = null;
    let isMuted = false;
  
    function randomDelay(min = 2000, max = 5000) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    function startGame() {
      result.textContent = "";
      gameBox.classList.remove("active");
      gameBox.textContent = "Wait for green...";
      gameBox.style.backgroundColor = "#222";
      waiting = true;
  
      timeoutID = setTimeout(() => {
        gameBox.classList.add("active");
        gameBox.textContent = "CLICK!";
        startTime = Date.now();
        waiting = false;
      }, randomDelay());
    }
  
    gameBox.addEventListener("click", () => {
      if (waiting) {
        clearTimeout(timeoutID);
        gameBox.textContent = "Too soon!";
        gameBox.style.backgroundColor = "#ff3333";
        gameBox.classList.remove("active");
        result.textContent = "";
        if (!isMuted) failSound.play().catch(err => console.error(err));
      } else if (startTime) {
        const reactionTime = Date.now() - startTime;
        result.textContent = `Your reaction time: ${reactionTime} ms`;
  
        if (bestTime === null || reactionTime < bestTime) {
          bestTime = reactionTime;
          scoreboard.textContent = `Best Time: ${bestTime} ms`;
        }
  
        if (!isMuted) successSound.play().catch(err => console.error(err));
  
        gameBox.classList.remove("active");
        gameBox.textContent = "Wait for green...";
        gameBox.style.backgroundColor = "#222";
        startTime = null;
        setTimeout(startGame, 1500);
      }
    });
  
    muteButton.addEventListener("click", () => {
      isMuted = !isMuted;
      if (isMuted) {
        muteButton.textContent = "🔇 Unmute";
        bgMusic.pause();
      } else {
        muteButton.textContent = "🔊 Mute";
        bgMusic.play().catch(err => console.error(err));
      }
    });
  
    document.body.addEventListener("click", () => {
      if (!isMuted && bgMusic.paused) {
        bgMusic.play().catch(err => console.error("Music play error:", err));
      }
    }, { once: true });
  
    startGame();
  });