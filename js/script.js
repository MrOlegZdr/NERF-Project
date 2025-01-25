"use strict";

// Import Swiper.js
// import Swiper from "https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

// Selecting elements for Start Page
const startPageSection = document.getElementById("start-page");
const btnStartPagePlayM = document.getElementById("play-minigame");
const btnStartPageWatch = document.getElementById("watch-video");
const btnStartPageViewR = document.getElementById("view-range");
const closeVideo = document.getElementById("btn-close");
const overlay = document.getElementById("overlay");
const modalVideo = document.getElementById("modal-video");
const promoWatch = document.getElementById("promo-watch");

// Selecting elements for Game Intro Page
const gameIntroSection = document.getElementById("game-intro");
const btnPlayGame = document.getElementById("play-game");
const blasterNameSelect = document.getElementById("blaster-name-select");
// const carouselSelectSwipe = document.querySelector(".carousel-select-swipe");

// Selecting elements for View Range Page
const viewRangeSection = document.getElementById("info-page");
const blasterInfo = document.getElementById("blaster-info");
// const carouselInfoSwipe = document.querySelector(".carousel-info-swipe");

// Selecting elements for Main Game Page
const mainGameSection = document.getElementById("game-page");
const soundShot = document.getElementById("sound-shot");
const soundReload = document.getElementById("sound-reload");
const soundHit = document.getElementById("sound-hit");
const soundMiss = document.getElementById("sound-miss");

// Selecting elements for Finish Game Page
const finishGameSection = document.getElementById("finish-game");
const finalScore = document.getElementById("final-score-val");
const promoEnd = document.getElementById("promo-end");

// Selecting common elements
const btnVisit = document.querySelectorAll(".visit-nerf");
const btnGoBack = document.querySelectorAll(".go-back");
const promoVideo = document.querySelectorAll(".video-element");
const btnCarouselPrev = document.querySelectorAll(".carousel-prev");
const btnCarouselNext = document.querySelectorAll(".carousel-next");

// Constants
// Blaster objects
const blasters = [
  {
    blasterName: "Volt SD-1",
    images: {
      select: "textures/Blasters/Blaster-1-select-Volt.png",
      info: "textures/Blasters/Blaster-1-info-Volt.png",
      descr: "textures/Info/Blaster-1-descr-Volt.png",
    },
  },
  {
    blasterName: "Commander",
    images: {
      select: "textures/Blasters/Blaster-2-select-Commander.png",
      info: "textures/Blasters/Blaster-2-info-Commander.png",
      descr: "textures/Info/Blaster-2-descr-Commander.png",
    },
  },
  {
    blasterName: "Shockwave",
    images: {
      select: "textures/Blasters/Blaster-3-select-Shockwave.png",
      info: "textures/Blasters/Blaster-3-info-Shockwave.png",
      descr: "textures/Info/Blaster-3-descr-Shockwave.png",
    },
  },
  {
    blasterName: "Echo",
    images: {
      select: "textures/Blasters/Blaster-4-select-Echo.png",
      info: "textures/Blasters/Blaster-4-info-Echo.png",
      descr: "textures/Info/Blaster-4-descr-Echo.png",
    },
  },
];
// const POSITIVE_THRESHOLD = 20;
// const NEGATIVE_THRESHOLD = -20;

// const swiperIntro = new Swiper("#game-intro .carousel-select-swipe", {
//   slidesPerView: 1,
//   loop: true,
//   navigation: {
//     nextEl: "#game-intro .carousel-next",
//     prevEl: "#game-intro .carousel-prev",
//   },
// });
// swiperIntro.on("slideChange", () => {
//   currentBlasterIndex = swiperIntro.realIndex;
//   updateBlasterData("select");
// });

// const swiperInfo = new Swiper("#info-page .carousel-info-swipe", {
//   slidesPerView: 1,
//   loop: true,
//   navigation: {
//     nextEl: "#info-page .carousel-next",
//     prevEl: "#info-page .carousel-prev",
//   },
// });

// swiperInfo.on("slideChange", () => {
//   currentBlasterIndex = swiperInfo.realIndex;
//   updateBlasterData("info");
// });

// let currentBlasterIndex, currentPageLabel, touchStartX, touchEndX;
let currentBlasterIndex;
init();

// Function to set initial values
function init() {
  currentBlasterIndex = 0;
  // currentPageLabel = "select";
  // touchStartX = 0;
  // touchEndX = 0;
  blasterNameSelect.textContent = blasters[0].blasterName;
  togglePageVisibility(startPageSection);
  initializeSwipers();
}

// Function to handle button clicks (for debugging)
const handleButtonClick = (button) => {
  console.log(`${button.textContent} clicked`);
};

// Function to toggle current page visibility:
// add hidden to all pages, which are not visiblePage
function togglePageVisibility(visiblePage) {
  [
    startPageSection,
    gameIntroSection,
    viewRangeSection,
    mainGameSection,
    finishGameSection,
    overlay,
    modalVideo,
  ].forEach((section) => {
    section.classList.toggle("hidden", section !== visiblePage);
  });
}

// Function to update blaster info in specific page
// function updateBlasterData() {
//   const currentImg = document.getElementById(
//     `blaster-image-${currentPageLabel}`
//   );
//   const currentName = document.getElementById(
//     `blaster-name-${currentPageLabel}`
//   );
//   currentImg.src = blasters[currentBlasterIndex].images[`${currentPageLabel}`];
//   currentName.textContent = blasters[currentBlasterIndex].blasterName;
//   blasterInfo.src = blasters[currentBlasterIndex].images["descr"];
// }

// Function to update blaster info in specific page
function updateBlasterData(pageLabel) {
  let currentImgLabel;
  switch (pageLabel) {
    case "select": {
      currentImgLabel = `#game-intro .carousel-image`;
      break;
    }
    case "info": {
      currentImgLabel = `#info-page .carousel-image`;
      break;
    }
  }
  const currentImg = document.querySelector(currentImgLabel);
  const currentName = document.getElementById(`blaster-name-${pageLabel}`);
  currentImg.src = blasters[currentBlasterIndex].images[`${pageLabel}`];
  currentName.textContent = blasters[currentBlasterIndex].blasterName;
  blasterInfo.src = blasters[currentBlasterIndex].images["descr"];
  // if (pageLabel === "select") {
  //   const currentImg = document.querySelector(`#game-intro .carousel-image`);
  //   const currentName = document.getElementById("blaster-name-select");
  //   currentImg.src = blasters[currentBlasterIndex].images.select;
  //   currentName.textContent = blasters[currentBlasterIndex].blasterName;
  // } else if (pageLabel === "info") {
  //   const currentImg = document.querySelector(`#info-page .carousel-image`);
  //   const currentName = document.getElementById("blaster-name-info");
  //   currentImg.src = blasters[currentBlasterIndex].images.info;
  //   currentName.textContent = blasters[currentBlasterIndex].blasterName;
  //   blasterInfo.src = blasters[currentBlasterIndex].images.descr;
  // }
}

// Function to initialize Swiper.js instances
function initializeSwipers() {
  // Swiper for Game Intro Page
  // const swiperIntro = new Swiper("#game-intro .carousel-select-swipe", {
  const swiperIntro = new Swiper("#game-intro .swiper", {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: "#game-intro .carousel-next",
      prevEl: "#game-intro .carousel-prev",
    },
  });

  swiperIntro.on("slideChange", () => {
    currentBlasterIndex = swiperIntro.realIndex;
    updateBlasterData("select");
  });

  // Swiper for View Range Page
  // const swiperInfo = new Swiper("#info-page .carousel-info-swipe", {
  const swiperInfo = new Swiper("#info-page .swiper", {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: "#info-page .carousel-next",
      prevEl: "#info-page .carousel-prev",
    },
  });

  swiperInfo.on("slideChange", () => {
    currentBlasterIndex = swiperInfo.realIndex;
    updateBlasterData("info");
  });
}

// Function to handle swipe
// function handleSwipe(pageLabel) {
//   const swipeThreshold = POSITIVE_THRESHOLD;
//   if (touchEndX < touchStartX - swipeThreshold) {
//     // Swipe left
//     currentBlasterIndex = (currentBlasterIndex + 1) % blasters.length;
//     currentPageLabel = pageLabel;
//     updateBlasterData();
//   } else if (touchEndX > touchStartX + swipeThreshold) {
//     // Swipe right
//     currentBlasterIndex =
//       (currentBlasterIndex - 1 + blasters.length) % blasters.length;
//     currentPageLabel = pageLabel;
//     updateBlasterData();
//   }
// }

// // Function for swipe handling with mouse
// // element - where to listen, pageLabel - current page label
// function addSwipeListeners(element, pageLabel) {
//   element.addEventListener("touchstart", (e) => {
//     touchStartX = e.changedTouches[0].clientX;
//   });
//   element.addEventListener("touchend", (e) => {
//     touchEndX = e.changedTouches[0].clientX;
//     handleSwipe(pageLabel);
//   });

//   // Mouse drag support
//   let isDragging = false;
//   let startX = 0;

//   element.addEventListener("mousedown", (e) => {
//     isDragging = true;
//     startX = e.clientX;
//   });

//   element.addEventListener("mousemove", (e) => {
//     if (!isDragging) return;
//     const deltaX = e.clientX - startX;
//     if (deltaX > POSITIVE_THRESHOLD || deltaX < NEGATIVE_THRESHOLD) {
//       touchStartX = startX;
//       touchEndX = e.clientX;
//       handleSwipe(pageLabel);
//       isDragging = false; // End the drag after a successful swipe
//     }
//   });

//   element.addEventListener("mouseup", () => {
//     isDragging = false;
//   });

//   element.addEventListener("mouseleave", () => {
//     isDragging = false;
//   });
// }

// Navigation between pages
btnStartPagePlayM.addEventListener("click", () => {
  togglePageVisibility(gameIntroSection);
  // currentPageLabel = "select";
  updateBlasterData("select");
  console.log(currentBlasterIndex);
});

btnStartPageWatch.addEventListener("click", openModalVideo);
closeVideo.addEventListener("click", closeModalVideo);

btnGoBack.forEach((button) => {
  button.addEventListener("click", () => {
    togglePageVisibility(startPageSection);
    promoWatch.pause();
    promoEnd.pause();
  });
});

btnStartPageViewR.addEventListener("click", () => {
  togglePageVisibility(viewRangeSection);
  // currentPageLabel = "info";
  updateBlasterData("info");
  console.log(currentBlasterIndex);
});

btnPlayGame.addEventListener("click", () => {
  togglePageVisibility(mainGameSection);
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

// Event listeners for carousel
// Previous Blaster
// btnCarouselPrev.forEach((button) => {
//   button.addEventListener("click", () => {
//     currentBlasterIndex =
//       (currentBlasterIndex - 1 + blasters.length) % blasters.length;
//     updateBlasterData();
//   });
// });

// // Next Blaster
// btnCarouselNext.forEach((button) => {
//   button.addEventListener("click", () => {
//     currentBlasterIndex = (currentBlasterIndex + 1) % blasters.length;
//     updateBlasterData();
//   });
// });

// // Swipe handling for Game Intro Page ("carousel-select")
// carouselSelectSwipe.addEventListener("touchstart", (e) => {
//   touchStartX = e.changedTouches[0].clientX;
// });
// carouselSelectSwipe.addEventListener("touchend", (e) => {
//   touchEndX = e.changedTouches[0].clientX;
//   handleSwipe("select");
// });

// // Swipe handling for View Range Page ("carousel-info")
// carouselInfoSwipe.addEventListener("touchstart", (e) => {
//   touchStartX = e.changedTouches[0].clientX;
// });
// carouselInfoSwipe.addEventListener("touchend", (e) => {
//   touchEndX = e.changedTouches[0].clientX;
//   handleSwipe("info");
// });

// addSwipeListeners(carouselSelectSwipe, "select");
// addSwipeListeners(carouselInfoSwipe, "info");

// Adding event listeners
// if (btnStartPagePlayM) {
//   btnStartPagePlayM.addEventListener("click", () =>
//     handleButtonClick(btnStartPagePlayM)
//   );
// }
// if (btnStartPageWatch) {
//   btnStartPageWatch.addEventListener("click", () =>
//     handleButtonClick(btnStartPageWatch)
//   );
// }

// if (btnVisit) {
//   btnVisit.forEach((button) => {
//     button.addEventListener("click", () => handleButtonClick(button));
//   });
// }

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
  isHit;

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
  rapidity = 500; // in ms
  reloadTime = 3000; // in ms
  magazin = 6;
  shotsNumber = 0;
  lastShotTime = 0;
  isHit = false;
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
  const x = randomFromToIncl(radius, canvas.width - radius);
  const y = randomFromToIncl(shift + radius, canvas.height - radius);
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

  targetPosition = { x, y, radius, worth: target.worth };
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

// Function to end the game
function endGame() {
  togglePageVisibility(finishGameSection);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  finalScore.textContent = score;
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

  console.log(`Click ${clickX}, ${clickY}`);

  if (targetPosition) {
    const dist = Math.sqrt(
      Math.pow(clickX - targetPosition.x, 2) +
        Math.pow(clickY - targetPosition.y, 2)
    );

    // Check if the clisck is within the target
    if (dist <= targetPosition.radius) {
      score += targetPosition.worth;
      targetPosition = null;
      isHit = true;
      soundHit.currentTime = 0;
      soundHit.play();
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
