const players = document.querySelector(".players");
const mainPlayer = document.querySelector(".player456");
const startBtn = document.querySelector(".start-btn");
const startLine = document.querySelector(".start-line");
const finishLine = document.querySelector(".finish-line");
const dollSound = document.querySelector(".doll-sound");
const eliminatedPlayerCount = document.querySelector(
  ".player-count"
);
const gameOverText = document.querySelector('.game-over')
let playersTimeout;
let mainPlayerTimeout;
let gameStarted = false;
let speed = 20;
let keyUp = false;
let keyDown = false;
let keyLeft = false;
let keyRight = false;
let dollTurned = false;
let lastPressed;
let playerEliminated = 0
let gameOver = false
let resetSound;
let checkPlayers
let isKeyDown = false

const makeRandomPlayers = () => {
  for (let i = 0; i < 156; i++) {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    players.appendChild(playerDiv);
    playerDiv.style.top =
      Math.random() *
        (window.innerHeight -
          mainPlayer.clientHeight -
          (startLine.offsetTop + 10)) +
      (startLine.offsetTop + 10) +
      "px";
    playerDiv.style.left =
      Math.random() * (window.innerWidth - playerDiv.clientWidth - 0) + 0 + "px";
  }
}

const keyup = (e) => {
  isKeyDown = false
  if (e.keyCode == 37) {
    keyLeft = false;
    lastPressed = "left";
  }
  if (e.keyCode == 39) {
    keyRight = false;
    lastPressed = "right";
  }
  if (e.keyCode == 38) {
    keyUp = false;
    lastPressed = "up";
  }
  if (e.keyCode == 40) {
    keyDown = false;
    lastPressed = "down";
  }
};

const keydown = (e) => {
  isKeyDown = true
  if (e.code == "KeyW" || e.code == "ArrowUp") {
    keyUp = true;
    lastPressed = "up";
  }
  if (e.code == "KeyS" || e.code == "ArrowDown") {
    keyDown = true;
    lastPressed = "down";
  }
  if (e.code == "KeyA" || e.code == "ArrowLeft") {
    keyLeft = true;
    lastPressed = "left";
  }
  if (e.code == "KeyD" || e.code == "ArrowRight") {
    keyRight = true;
    lastPressed = "right";
  }
};

const move = () => {
  let posX = mainPlayer.offsetLeft;
  let posY = mainPlayer.offsetTop;
  if(gameOver){
    return
  }
  if (keyUp) {
    let newTop = posY - 1;
    mainPlayer.style.top = newTop + "px";
  }
  if (keyDown) {
    let newTop = posY + 1;
    mainPlayer.style.top = newTop + "px";
  }
  if (keyLeft) {
    let newLeft = posX - 1;
    mainPlayer.style.left = newLeft + "px";
  }
  if (keyRight) {
    let newLeft = posX + 1;
    mainPlayer.style.left = newLeft + "px";
  }
};


const movePlayers = () => {
  const players = document.querySelectorAll(".player");
  let player = players[Math.floor(Math.random() * players.length)];
  let posX = player.offsetLeft;
  let posY = player.offsetTop;
  
  if(gameOver){
    return
  }
  if(dollTurned){
    if(players.length < 50 && players.length > 20){
      let eliminationValue = Math.floor(Math.random() * 100);
      if(eliminationValue > 90){
        speed = 1
      }
      else{
        speed = 0
      }
    }
    else if(players.length < 20){
      let eliminationValue = Math.floor(Math.random() * 100);
      if(eliminationValue > 97){ 
        speed = 1
      }else{
        speed = 0
      }
    }
    else{
      speed = Math.floor(Math.random() * 2)
    }
    if (speed > 0) {
      player.remove();
      playerEliminated++
      eliminatedPlayerCount.textContent = playerEliminated
    }
    
  }
  
  let newTop = posY - speed;
  let newLeft;
  if (Math.floor(Math.random() * 2) > 0) {
    newLeft = posX + speed;
  } else {
    newLeft = posX - speed;
  }
  
  if (newLeft < 0) {
    newLeft = 0;
  }
  player.style.top = newTop + "px";
  
  if (player.offsetLeft > window.innerWidth - player.clientWidth - 50) {
    player.style.left = posX - 50 + "px";
    if(dollTurned){
      player.remove()
    }
  } else {
    player.style.left = newLeft + "px";
  }
  
  if (player.offsetTop < finishLine.offsetTop) {
    player.remove();
  }
};

const checkGameOver = () => {
  if (dollTurned && (keyUp || keyDown || keyRight || keyLeft)) {
    gameOverText.classList.add("show");
    gameOver = true;
    clearInterval(mainPlayerTimeout)
    clearInterval(playersTimeout)
    clearInterval(checkPlayers)
    clearInterval(resetSound)
    dollSound.currentTime = 0.5
    dollSound.pause()
    setTimeout(() => {
      gameOverText.classList.remove("show");
      startBtn.classList.remove("fade");
    }, 3000);
    return true
  }
}

startBtn.onclick = () => {
  gameStarted = true;
  gameOver = false
  const players = document.querySelectorAll('.player')
  if(players.length > 1){
    players.forEach(player => {
      player.remove()
    })
  }
  makeRandomPlayers()
  startBtn.classList.add("fade");
  startBtn.addEventListener("transitionend", () => {
    playersTimeout = setInterval(movePlayers, 100);
    mainPlayerTimeout = setInterval(move, 50);
    gameOverCheck = setInterval(checkGameOver, 50)
    dollSound.currentTime = 0.5
    dollSound.play()

    checkPlayers = setInterval(() => {
      dollTurned = true
    }, 6000)

    resetSound = setInterval(() => {
      console.log("its still working....")
      dollTurned = false
      speed = 20
      dollSound.currentTime = 0.5
    }, 12000)
  });
};

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

