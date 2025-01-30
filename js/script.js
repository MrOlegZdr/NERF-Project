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
const soundShot = document.getElementById("sound-shot");
const soundReload = document.getElementById("sound-reload");
const soundHit = document.getElementById("sound-hit");
const soundMiss = document.getElementById("sound-miss");

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
const blasters = [
  {
    blasterName: "Elite 2.0 Volt SD-1",
    images: {
      select: "textures/Blasters/Blaster-1-select-Volt.gif",
      info: "textures/Blasters/Blaster-1-info-Volt.gif",
    },
    rapidity: 1000, // in ms
    reloadTime: 1000, // in ms
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
    reloadTime: 5500, // in ms
    magazin: 10,
  },
];

let swiper, currentBlasterIndex;
init();

// Function to set initial values
function init() {
  currentBlasterIndex = 0;
  blasterNameSelect.textContent = blasters[0].blasterName;
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
  blasterNameSelect.textContent = blasters[currentBlasterIndex].blasterName;
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
    if (blasters[index].images[`${pageLabel}`]) {
      img.src = blasters[index].images[`${pageLabel}`];
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
const gameDuration = 20; // 20 seconds

const targets = [
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
  countdown,
  startTime,
  isReloading,
  lastTargetTime,
  targetPosition,
  rapidity,
  reloadTime,
  magazin,
  shotsNumber,
  lastShotTime,
  isHit,
  crackSize;

// Append canvas to the game page
canvas.width = startPageSection.clientWidth;
canvas.height = startPageSection.clientHeight;
mainGameSection.appendChild(canvas);
const shift = canvas.height * 0.17; // Shift from the top of the page with logo

// Function to start the game
function startGame() {
  score = 0;
  countdown = gameDuration;
  isReloading = false;
  startTime = null;
  lastTargetTime = 0;
  targetPosition = null;
  ({ rapidity, reloadTime, magazin } = blasters[currentBlasterIndex]);
  shotsNumber = 0;
  lastShotTime = 0;
  isHit = false;
  crackSize = 10;
  currentAnim = requestAnimationFrame(animateGame);
}

function animateGame() {
  const currentTime = performance.now();
  if (!startTime) {
    startTime = currentTime;
  }
  const elapsedTime = (currentTime - startTime) / 1000;

  // Update timer
  countdown = Math.max(0, gameDuration - elapsedTime);
  if (lastTargetTime === 0 || elapsedTime - lastTargetTime >= 1 || isHit) {
    isHit = false;
    lastTargetTime = elapsedTime;
    drawTarget();
  }

  // Draw timer and score
  drawText(
    `TIME: ${countdown.toFixed(1)} SEC`,
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

  drawText(
    `MAGAZIN: ${isReloading ? "..." : magazin - shotsNumber}`,
    canvas.clientWidth * 0.77,
    canvas.clientHeight * 0.07,
    "15px Eurostile",
    "#09d1e1"
  );

  if (countdown > 0) {
    // Continue the loop
    currentAnim = requestAnimationFrame(animateGame);
  } else {
    endGame();
    return;
  }
}

// Function to create and draw a target
function drawTarget() {
  const target = targets[randomFromToIncl(0, 3)];
  const radius = target.radius;
  ctx.clearRect(0, shift, canvas.width, canvas.height - shift);
  const x = randomFromToIncl(
    radius + crackSize,
    canvas.width - radius - crackSize
  );
  const y = randomFromToIncl(
    shift + radius + crackSize,
    canvas.height - radius - crackSize
  );
  ctx.fillStyle = "#06142a";
  ctx.strokeStyle = "#f47921";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, target.innerRadius, 0, Math.PI * 2);
  ctx.stroke();
  drawText(
    target.worth,
    x - 2,
    y,
    "16px Eurostile",
    "white",
    "center",
    "middle",
    false
  );

  targetPosition = {
    x,
    y,
    radius,
    innerRadius: target.innerRadius,
    worth: target.worth,
  };
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

function drawHit(targetPosition) {
  ctx.clearRect(0, shift, canvas.width, canvas.height - shift);
  const r = targetPosition.radius;
  const iR = targetPosition.innerRadius;
  let x, y;
  const gap = crackSize / 2;
  ctx.fillStyle = "#06142a";
  ctx.strokeStyle = "#f47921";
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      x = targetPosition.x + gap * (1 - i);
      y = targetPosition.y;
    } else {
      x = targetPosition.x;
      y = targetPosition.y + gap * (2 * i - 1);
    }
    const startAngel =
      i === 0 ? Math.Pi * 1.75 : Math.Pi * (0.25 * (2 * i - 1));
    const endAngel = Math.Pi * 0.25 * (2 * i + 1);
    ctx.beginPath();
    ctx.arc(x, y, r, startAngel, endAngel);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, iR, startAngel, endAngel);
    ctx.stroke();
  }
}

// Function to end the game
function endGame() {
  togglePageVisibility(finishGameSection);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  finalScore.textContent = score;
  finalBlasterImg.src = blasters[currentBlasterIndex].images["select"];
  promoEnd.currentTime = 0;
  promoEnd.play();
}

// Event listener for mouse clicks or taps
canvas.addEventListener("click", (event) => {
  const currentTime = performance.now();

  // Prevent shooting if within rapidity timeframe
  if (!isReloading && currentTime - lastShotTime < rapidity) {
    // Just to check what event was
    console.log("Shot delay");
    return;
  } else if (isReloading && currentTime - lastShotTime < reloadTime) {
    // Just to check what event was
    console.log("Reloading");
    return;
  }

  lastShotTime = currentTime;
  shotsNumber++;
  isReloading = false;

  soundShot.currentTime = 0;
  soundShot.play();

  // Get click position
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Shot coordinates
  // console.log(`Click ${clickX}, ${clickY}`);

  if (targetPosition) {
    const dist = Math.sqrt(
      Math.pow(clickX - targetPosition.x, 2) +
        Math.pow(clickY - targetPosition.y, 2)
    );

    // Check if the clisck is within the target
    if (dist <= targetPosition.radius) {
      score += targetPosition.worth;
      isHit = true;
      soundHit.currentTime = 0;
      soundHit.play();
      drawHit(targetPosition);
      targetPosition = null;
    } else {
      soundMiss.currentTime = 0;
      soundMiss.volume = 0.3;
      soundMiss.play();
    }
  }

  if (shotsNumber === magazin) {
    shotsNumber = 0;
    isReloading = true;
    soundLoopReload(reloadTime);
  }
});

function soundLoopReload(reloadTime) {
  const soundStartTime = performance.now();
  soundReload.currentTime = 0;
  soundReload.play();
  soundReload.addEventListener("ended", function handleEnd() {
    const soundEndTime = performance.now();
    if (countdown > 0 && soundEndTime - soundStartTime < reloadTime) {
      soundReload.currentTime = 0;
      soundReload.play();
    } else {
      soundReload.removeEventListener("ended", handleEnd);
      isReloading = false;
    }
  });
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
