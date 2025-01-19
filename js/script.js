"use strict";

// Selecting elements for Start Page
const startPageSection = document.getElementById("start-page");
const btnStartPagePlayM = document.getElementById("play-minigame");
const btnStartPageWatch = document.getElementById("watch-video");
const btnStartPageViewR = document.getElementById("view-range");

// Selecting elements for Game Intro Page
const gameIntroSection = document.getElementById("game-intro");
const btnPlayGame = document.getElementById("play-game");
const blasterNameSelect = document.getElementById("blaster-name-select");
const carouselSelectSwipe = document.querySelector(".carousel-select-swipe");

// Selecting elements for View Range Page
const viewRangeSection = document.getElementById("info-page");
const blasterInfo = document.getElementById("blaster-info");
const carouselInfoSwipe = document.querySelector(".carousel-info-swipe");

// Selecting elements for Main Game Page
const mainGameSection = document.getElementById("game-page");

// Selecting common elements
const btnVisit = document.querySelectorAll(".visit-nerf");
const btnGoBack = document.querySelectorAll(".go-back");
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
const POSITIVE_THRESHOLD = 20;
const NEGATIVE_THRESHOLD = -20;

let currentBlasterIndex, currentPageLabel, touchStartX, touchEndX;
init();

// Function to set initial values
function init() {
  currentBlasterIndex = 0;
  currentPageLabel = "select";
  touchStartX = 0;
  touchEndX = 0;
  blasterNameSelect.textContent = blasters[0].blasterName;
  togglePageVisibility(startPageSection);
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
  ].forEach((section) => {
    section.classList.toggle("hidden", section !== visiblePage);
  });
}

// Function to update blaster info in specific page
function updateBlasterData() {
  const currentImg = document.getElementById(
    `blaster-image-${currentPageLabel}`
  );
  const currentName = document.getElementById(
    `blaster-name-${currentPageLabel}`
  );
  currentImg.src = blasters[currentBlasterIndex].images[`${currentPageLabel}`];
  currentName.textContent = blasters[currentBlasterIndex].blasterName;
  blasterInfo.src = blasters[currentBlasterIndex].images["descr"];
}

// Function to handle swipe
function handleSwipe(pageLabel) {
  const swipeThreshold = POSITIVE_THRESHOLD;
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left
    currentBlasterIndex = (currentBlasterIndex + 1) % blasters.length;
    currentPageLabel = pageLabel;
    updateBlasterData();
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right
    currentBlasterIndex =
      (currentBlasterIndex - 1 + blasters.length) % blasters.length;
    currentPageLabel = pageLabel;
    updateBlasterData();
  }
}

// Function for swipe handling with mouse
// element - where to listen, pageLabel - current page label
function addSwipeListeners(element, pageLabel) {
  element.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  element.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe(pageLabel);
  });

  // Mouse drag support
  let isDragging = false;
  let startX = 0;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  element.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (deltaX > POSITIVE_THRESHOLD || deltaX < NEGATIVE_THRESHOLD) {
      touchStartX = startX;
      touchEndX = e.clientX;
      handleSwipe(pageLabel);
      isDragging = false; // End the drag after a successful swipe
    }
  });

  element.addEventListener("mouseup", () => {
    isDragging = false;
  });

  element.addEventListener("mouseleave", () => {
    isDragging = false;
  });
}

// Navigation between pages
btnStartPagePlayM.addEventListener("click", () => {
  togglePageVisibility(gameIntroSection);
  currentPageLabel = "select";
  updateBlasterData();
});

btnGoBack.forEach((button) => {
  button.addEventListener("click", () => {
    togglePageVisibility(startPageSection);
  });
});

btnStartPageViewR.addEventListener("click", () => {
  togglePageVisibility(viewRangeSection);
  currentPageLabel = "info";
  updateBlasterData();
});

btnPlayGame.addEventListener("click", () => {
  togglePageVisibility(mainGameSection);
});

// Event listeners for carousel
// Previous Blaster
btnCarouselPrev.forEach((button) => {
  button.addEventListener("click", () => {
    currentBlasterIndex =
      (currentBlasterIndex - 1 + blasters.length) % blasters.length;
    updateBlasterData();
  });
});

// Next Blaster
btnCarouselNext.forEach((button) => {
  button.addEventListener("click", () => {
    currentBlasterIndex = (currentBlasterIndex + 1) % blasters.length;
    updateBlasterData();
  });
});

// Swipe handling for Game Intro Page ("carousel-select")
carouselSelectSwipe.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
carouselSelectSwipe.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe("select");
});

// Swipe handling for View Range Page ("carousel-info")
carouselInfoSwipe.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
carouselInfoSwipe.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe("info");
});

addSwipeListeners(carouselSelectSwipe, "select");
addSwipeListeners(carouselInfoSwipe, "info");

// Adding event listeners
if (btnStartPagePlayM) {
  btnStartPagePlayM.addEventListener("click", () =>
    handleButtonClick(btnStartPagePlayM)
  );
}
if (btnStartPageWatch) {
  btnStartPageWatch.addEventListener("click", () =>
    handleButtonClick(btnStartPageWatch)
  );
}

if (btnVisit) {
  btnVisit.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });
}
