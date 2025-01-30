"use strict";

import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

// Selecting elements for Start Page
const startPageSection = document.getElementById("start-page");
const btnStartPagePlayM = document.getElementById("play-minigame");
const btnStartPageWatch = document.getElementById("watch-video");
const btnStartPageViewR = document.getElementById("view-range");

// Selecting elements for Modal Watch Video
const closeVideo = document.getElementById("btn-close");
const overlay = document.getElementById("overlay");
const modalVideo = document.getElementById("modal-video");
const promoWatch = document.getElementById("promo-watch");

// Selecting elements for Game Intro Page
const gameIntroSection = document.getElementById("game-intro");
const btnPlayGame = document.getElementById("play-game");
const blasterNameSelect = document.getElementById("blaster-name");

// Selecting elements for View Range Page
const viewRangeSection = document.getElementById("info-page");

// Selecting elements for Main Game Page
const mainGameSection = document.getElementById("game-page");

// Selecting elements for Finish Game Page
const finishGameSection = document.getElementById("finish-game");
const finalScore = document.getElementById("final-score-val");
const finalBlasterImg = document.querySelector(".final-result img");
const promoEnd = document.getElementById("promo-end");

// Selecting common elements
const btnVisit = document.querySelectorAll(".visit-nerf");
const btnGoBack = document.querySelectorAll(".go-back");
const promoVideo = document.querySelectorAll(".video-element");
const swiperPage = document.getElementById("swiper-page");

// Constants
// Blaster objects
const BLASTERS = [
  {
    blasterName: "Elite 2.0 Volt SD-1",
    images: {
      select: "textures/Blasters/Blaster-1-select-Volt.gif",
      info: "textures/Blasters/Blaster-1-info-Volt.gif",
    },
    rapidity: 1000, // in ms
    reloadTime: 500, // in ms
    magazin: 1,
  },
  {
    blasterName: "Elite 2.0 Commander",
    images: {
      select: "textures/Blasters/Blaster-2-select-Commander.gif",
      info: "textures/Blasters/Blaster-2-info-Commander.gif",
    },
    rapidity: 500, // in ms
    reloadTime: 3000, // in ms
    magazin: 6,
  },
  {
    blasterName: "Elite 2.0 Shockwave",
    images: {
      select: "textures/Blasters/Blaster-3-select-Shockwave.gif",
      info: "textures/Blasters/Blaster-3-info-Shockwave.gif",
    },
    rapidity: 500, // in ms
    reloadTime: 7500, // in ms
    magazin: 15,
  },
  {
    blasterName: "Elite 2.0 Echo",
    images: {
      select: "textures/Blasters/Blaster-4-select-Echo.gif",
      info: "textures/Blasters/Blaster-4-info-Echo.gif",
    },
    rapidity: 500, // in ms
    reloadTime: 5000, // in ms
    magazin: 10,
  },
];
const BLACK = "#06142a";
const ORANG = "#f47921";
const AQMRN = "#09d1e1";

let swiper, currentBlasterIndex;
init();

// Function to set initial values
function init() {
  currentBlasterIndex = 0;
  blasterNameSelect.textContent = BLASTERS[0].blasterName;
  togglePageVisibility(startPageSection);
}

// Function to handle button clicks (for debugging)
const handleButtonClick = (button) => {
  console.log(`${button.textContent} clicked`);
};

// Function to toggle current page visibility:
// add hidden to all pages, which are not visiblePage
function togglePageVisibility(visiblePage, isSwiperHidden = true) {
  [
    startPageSection,
    gameIntroSection,
    viewRangeSection,
    mainGameSection,
    finishGameSection,
    overlay,
    modalVideo,
    swiperPage,
  ].forEach((section) => {
    section.classList.toggle("hidden", section !== visiblePage);
  });
  swiperPage.classList.toggle("hidden", isSwiperHidden);
}

// Function to update blaster info in specific page
function updateBlasterData() {
  blasterNameSelect.textContent = BLASTERS[currentBlasterIndex].blasterName;
}

// Function to initialize Swiper.js instances
function initializeSwipers(pageLabel) {
  swiper = new Swiper("#swiper-page .swiper", {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: "#sw-next",
      prevEl: "#sw-prev",
    },
  });

  const slides = document.querySelectorAll(".swiper-slide img");

  slides.forEach((img, index) => {
    if (BLASTERS[index].images[`${pageLabel}`]) {
      img.src = BLASTERS[index].images[`${pageLabel}`];
    }
  });

  swiper.slideTo(currentBlasterIndex);
  swiper.on("slideChange", () => {
    currentBlasterIndex = swiper.realIndex;
    updateBlasterData();
  });
}

// Navigation between pages
btnStartPagePlayM.addEventListener("click", () => {
  togglePageVisibility(gameIntroSection, false);
  updateBlasterData();
  initializeSwipers("select");
});

btnStartPageWatch.addEventListener("click", openModalVideo);
closeVideo.addEventListener("click", closeModalVideo);

btnGoBack.forEach((button) => {
  button.addEventListener("click", () => {
    togglePageVisibility(startPageSection);
    swiper.destroy();
    promoWatch.pause();
    promoEnd.pause();
  });
});

btnStartPageViewR.addEventListener("click", () => {
  togglePageVisibility(viewRangeSection, false);
  updateBlasterData();
  initializeSwipers("info");
});

btnPlayGame.addEventListener("click", () => {
  togglePageVisibility(mainGameSection);
  swiper.destroy();
  startGame();
});

btnVisit.forEach((button) => {
  button.addEventListener("click", () => {
    promoEnd.pause();
    window.open("https://shop.hasbro.com/en-us/nerf", "_blank");
  });
});

overlay.addEventListener("click", closeModalVideo);

function openModalVideo() {
  modalVideo.classList.remove("hidden");
  overlay.classList.remove("hidden");
  promoWatch.currentTime = 0;
  promoWatch.play();
}

function closeModalVideo() {
  modalVideo.classList.add("hidden");
  overlay.classList.add("hidden");
  promoWatch.pause();
}

// Game logic variables
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const activeSounds = new Set();
const GAME_TIME = 20000; // 20 seconds
const SPAWN_INTERVAL = 1000; // 1 second
const SCORE_DELAY_VIS = 1000; // 1 second
const EXPLOSION_DURATION = 500;
const RELOAD_BULLET = 500;
const SECTOR_COUNT = 7;
const GAP = 15;
const TARGETS = [
  {
    worth: 10,
    radius: 44,
    innerRadius: 22,
  },
  {
    worth: 20,
    radius: 35,
    innerRadius: 22,
  },
  {
    worth: 50,
    radius: 28,
    innerRadius: 18,
  },
  {
    worth: 100,
    radius: 21,
    innerRadius: 0,
  },
];

let currentAnim,
  score,
  startTime,
  isReloading,
  rapidity,
  // reloadTime,
  magazin,
  lastShotTime,
  targets,
  explosions,
  scoreAnimations,
  lastSpawnTime,
  gameOver,
  isPaused,
  pausedAt,
  totalPausedTime;

// Append canvas to the game page
canvas.width = startPageSection.clientWidth;
canvas.height = startPageSection.clientHeight;
mainGameSection.appendChild(canvas);
const SHIFT = canvas.height * 0.17; // Shift from the top of the page with logo

// Function to start the game
function startGame() {
  score = 0;
  isReloading = false;
  targets = [];
  explosions = [];
  scoreAnimations = [];
  startTime = null;
  lastSpawnTime = 0;
  gameOver = false;
  isPaused = false;
  // ({ rapidity, reloadTime, magazin } = BLASTERS[currentBlasterIndex]);
  ({ rapidity, magazin } = BLASTERS[currentBlasterIndex]);
  lastShotTime = 0;
  pausedAt = 0;
  totalPausedTime = 0;
  currentAnim = requestAnimationFrame(animateGame);
}

function animateGame(timestamp) {
  if (gameOver) return;
  if (isPaused) {
    requestAnimationFrame(animateGame);
    return;
  }

  if (!startTime) startTime = timestamp;
  const elapsedTime = timestamp - startTime - totalPausedTime;

  if (elapsedTime > GAME_TIME) {
    endGame();
    return;
  }

  ctx.clearRect(0, SHIFT, canvas.width, canvas.height - SHIFT);
  if (timestamp - lastSpawnTime >= SPAWN_INTERVAL) {
    spawnTarget();
    lastSpawnTime = timestamp;
  }

  targets.forEach((target) => {
    target.opacity = Math.min(target.opacity + 0.02, 1);
    drawTarget(target);
  });

  drawExplosions(timestamp);

  scoreAnimations = scoreAnimations.filter(
    (anim) => timestamp - anim.time < SCORE_DELAY_VIS
  );
  scoreAnimations.forEach((anim) => {
    ctx.globalAlpha = anim.opacity;
    ctx.shadowColor = AQMRN;
    ctx.shadowBlur = 10;
    drawText(
      `+${anim.worth}`,
      anim.x,
      anim.y,
      "bold 20px Eurostile",
      "white",
      false
    );
    anim.opacity -= 0.02;
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  });

  drawGameInfo();

  requestAnimationFrame(animateGame);
}

function spawnTarget() {
  if (gameOver) return;
  const targetType = TARGETS[randomFromToIncl(0, 3)];
  const x = randomFromToIncl(
    targetType.radius + GAP,
    canvas.width - targetType.radius - GAP
  );
  const y = randomFromToIncl(
    SHIFT + targetType.radius + GAP,
    canvas.height - targetType.radius - GAP
  );
  targets.push({ x, y, ...targetType, opacity: 0 });
}

// Function to draw a target
function drawTarget(target) {
  ctx.globalAlpha = target.opacity;
  ctx.fillStyle = BLACK;
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ORANG;
  ctx.stroke();
  if (target.innerRadius > 0) {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.innerRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawText(
    target.worth,
    target.x - 2,
    target.y,
    "16px Eurostile",
    "white",
    "center",
    "middle",
    false
  );
  ctx.globalAlpha = 1;
}

// Function to draw text on canvas
function drawText(
  text,
  x,
  y,
  font = "14px Eurostile",
  color = "white",
  align = "left",
  baseline = "bottom",
  isClear = true
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  const clearWidth = ctx.measureText(text).width * 1.2;
  const clearHeight = parseInt(font);

  if (isClear) {
    ctx.clearRect(x, y - clearHeight, clearWidth, clearHeight);
  }
  ctx.fillText(text, x, y);
}

function randomFromToIncl(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

// Event listener for mouse clicks or taps
canvas.addEventListener("click", (event) => {
  if (gameOver) return;
  if (isReloading || performance.now() - lastShotTime < rapidity) return;
  lastShotTime = performance.now();
  magazin--;
  playSound("sounds/One-shot.mp3");
  recoilEffect();

  let hit = false;
  targets.forEach((target, index) => {
    const dx = event.offsetX - target.x;
    const dy = event.offsetY - target.y;
    if (Math.sqrt(dx * dx + dy * dy) < target.radius) {
      hit = true;
      playSound("sounds/Hit.mp3");
      score += target.worth;
      targets.splice(index, 1);
      createExplosion(target);
      scoreAnimations.push({
        x: target.x,
        y: target.y,
        worth: target.worth,
        opacity: 1,
        time: performance.now(),
      });
    }
  });

  if (!hit) {
    playSound("sounds/Miss.mp3");
    shakeScreen();
  }

  if (magazin === 0) reload();
});

function reload() {
  isReloading = true;
  mainGameSection.style.cursor = "wait";
  let bulletsLoaded = 0;
  let reloadStart = performance.now();

  function reloadStep() {
    if (gameOver) {
      isReloading = false;
      stopAllSounds();
      return;
    }
    if (bulletsLoaded < BLASTERS[currentBlasterIndex].magazin) {
      if (
        performance.now() - reloadStart >=
        RELOAD_BULLET * (bulletsLoaded + 1)
      ) {
        playSound("sounds/Reload-one-bullet.mp3");
        bulletsLoaded++;
      }
      requestAnimationFrame(reloadStep);
    } else {
      magazin = BLASTERS[currentBlasterIndex].magazin;
      mainGameSection.style.cursor = 'url("textures/aim.cur"), crosshair';
      isReloading = false;
    }
  }
  reloadStep();
}

function playSound(file) {
  const audio = new Audio(file);
  activeSounds.add(audio);
  audio.play();
  audio.onended = () => {
    activeSounds.delete(audio);
  };
}

function stopAllSounds() {
  activeSounds.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  activeSounds.clear();
}

function shakeScreen() {
  canvas.style.transform = "translateX(5px)";
  setTimeout(() => (canvas.style.transform = "translateX(-5px)"), 50);
  setTimeout(() => (canvas.style.transform = "translateX(0)"), 100);
}

function recoilEffect() {
  canvas.style.transform = "scale(0.98)";
  setTimeout(() => (canvas.style.transform = "scale(1)"), 100);
}

function createExplosion(target) {
  let explosion = {
    x: target.x,
    y: target.y,
    radius: target.radius,
    innerRadius: target.innerRadius,
    time: performance.now(),
    sectors: [],
  };

  for (let i = 0; i < SECTOR_COUNT; i++) {
    let angleStart = (i * 2 * Math.PI) / SECTOR_COUNT;
    let angleEnd = ((i + 1) * 2 * Math.PI) / SECTOR_COUNT;
    let angleMid = (angleStart + angleEnd) / 2;

    let sector = {
      angleStart,
      angleEnd,
      dx: Math.cos(angleMid) * GAP,
      dy: Math.sin(angleMid) * GAP,
    };

    explosion.sectors.push(sector);
  }
  explosions.push(explosion);
}

function drawExplosions(timestamp) {
  explosions = explosions.filter(
    (exp) => timestamp - exp.time < EXPLOSION_DURATION
  );

  explosions.forEach((exp) => {
    let progress = (timestamp - exp.time) / EXPLOSION_DURATION;
    let easeOut = 1 - Math.pow(1 - progress, 3); // Fade in the end

    drawExplosionSectorsPizza(exp, easeOut);
  });
}

function drawExplosionSectorsPizza(explosion, progress) {
  explosion.sectors.forEach((sector) => {
    let offsetX = sector.dx * progress;
    let offsetY = sector.dy * progress;

    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.moveTo(explosion.x + offsetX, explosion.y + offsetY);
    ctx.arc(
      explosion.x + offsetX,
      explosion.y + offsetY,
      explosion.radius,
      sector.angleStart,
      sector.angleEnd
    );
    ctx.lineTo(explosion.x + offsetX, explosion.y + offsetY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = ORANG;
    ctx.beginPath();
    ctx.arc(
      explosion.x + offsetX,
      explosion.y + offsetY,
      explosion.radius,
      sector.angleStart,
      sector.angleEnd
    );
    ctx.stroke();

    if (explosion.innerRadius > 0) {
      ctx.beginPath();
      ctx.arc(
        explosion.x + offsetX,
        explosion.y + offsetY,
        explosion.innerRadius,
        sector.angleStart,
        sector.angleEnd
      );
      ctx.stroke();
    }
  });
}

function drawGameInfo() {
  drawText(
    `MAGAZIN: ${isReloading ? "..." : magazin}`,
    canvas.clientWidth * 0.77,
    canvas.clientHeight * 0.07,
    "15px Eurostile",
    "#09d1e1"
  );

  const remainingTime = Math.max(
    (GAME_TIME - (performance.now() - startTime - totalPausedTime)) / 1000,
    0
  );

  drawText(
    `TIME: ${remainingTime.toFixed(1)} SEC`,
    canvas.clientWidth * 0.77,
    canvas.clientHeight * 0.11,
    "15px Eurostile",
    "#09d1e1"
  );

  drawText(
    `SCORE: ${score}`,
    canvas.clientWidth * 0.77,
    canvas.clientHeight * 0.17,
    "24px Eurostile",
    "#09d1e1"
  );
}

// Function to end the game
function endGame() {
  gameOver = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopAllSounds();
  togglePageVisibility(finishGameSection);
  finalScore.textContent = score;
  finalBlasterImg.src = BLASTERS[currentBlasterIndex].images["select"];
  promoEnd.currentTime = 0;
  promoEnd.play();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseGame();
  } else {
    resumeGame();
  }
});

function pauseGame() {
  if (!gameOver && !isPaused) {
    isPaused = true;
    pausedAt = performance.now();
  }
}

function resumeGame() {
  if (!gameOver && isPaused) {
    isPaused = false;
    totalPausedTime += performance.now() - pausedAt;
    lastSpawnTime = performance.now();
    animateGame(performance.now());
  }
}

promoVideo.forEach((video) => {
  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("dblclick", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  });
});
