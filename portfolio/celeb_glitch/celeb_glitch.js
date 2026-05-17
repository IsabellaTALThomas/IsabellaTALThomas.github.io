let celebImages = [];

let celebNames = [
  "Emily Schunk",
  "Justin Bieber",
  "Mark Fischbach",
  "Olivia Caridi",
  "Simon Cowell"
];

let urls = [
  [
    "https://isabellatalthomas.github.io/celeb_glitches/emiru/emiru_glitch3.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/emiru/emiru_glitch2.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/emiru/emiru_glitch1.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/emiru/emiru.jpeg"
  ],
  [
    "https://isabellatalthomas.github.io/celeb_glitches/justin_bieber/justin_bieber_glitch3.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/justin_bieber/justin_bieber_glitch2.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/justin_bieber/justin_bieber_glitch1.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/justin_bieber/justin_bieber.jpg"
  ],
  [
    "https://isabellatalthomas.github.io/celeb_glitches/markiplier/markiplier_glitch3.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/markiplier/markiplier_glitch2.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/markiplier/markiplier_glitch1.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/markiplier/markiplier.jpeg"
  ],
  [
    "https://isabellatalthomas.github.io/celeb_glitches/olivia_caridi/olivia_caridi_glitch3.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/olivia_caridi/olivia_caridi_glitch2.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/olivia_caridi/olivia_caridi_glitch1.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/olivia_caridi/olivia_caridi.jpg"
  ],
  [
    "https://isabellatalthomas.github.io/celeb_glitches/simon_cowell/simon_cowell_glitch3.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/simon_cowell/simon_cowell_glitch2.jpg",
    "https://isabellatalthomas.github.io/celeb_glitches/simon_cowell/simon_cowell_glitch1.jpeg",
    "https://isabellatalthomas.github.io/celeb_glitches/simon_cowell/simon_cowell.jpg"
  ]
];

let currentCeleb = 0;

let glitch3Layer;
let glitch2Layer;
let glitch1Layer;
let activePeelLayer = null;

let imageSize = 600;
let menuHeight = 120;
let peelState = [];
let brushSize = 200;

function preload() {
  for (let i = 0; i < urls.length; i++) {
    celebImages[i] = [];

    for (let j = 0; j < urls[i].length; j++) {
      celebImages[i][j] = loadImage(urls[i][j]);
    }
  }
}

function setup() {
  createCanvas(imageSize, imageSize + menuHeight);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      celebImages[i][j].resize(imageSize, imageSize);
    }
  }

  resetLayers();
}

function draw() {
  background(230);

  // Bottom/original image
  image(celebImages[currentCeleb][3], 0, 0, imageSize, imageSize);

  // Glitch layers above it
  image(glitch1Layer, 0, 0);
  image(glitch2Layer, 0, 0);
  image(glitch3Layer, 0, 0);

  drawMenu();
}

function mousePressed() {
  checkButtons();

  if (mouseY < imageSize) {
    activePeelLayer = getTopLayerUnderMouse();
    peelLayer();
  }
}

function mouseDragged() {
  peelLayer();
}

function mouseReleased() {
  activePeelLayer = null;
}

function getTopLayerUnderMouse() {
  let mx = floor(mouseX);
  let my = floor(mouseY);

  if (alpha(glitch3Layer.get(mx, my)) > 10) {
    return glitch3Layer;
  } else if (alpha(glitch2Layer.get(mx, my)) > 10) {
    return glitch2Layer;
  } else if (alpha(glitch1Layer.get(mx, my)) > 10) {
    return glitch1Layer;
  }

  return null;
}

function peelLayer() {
  if (
    activePeelLayer === null ||
    mouseX < 0 ||
    mouseX >= imageSize ||
    mouseY < 0 ||
    mouseY >= imageSize
  ) {
    return;
  }

  activePeelLayer.erase();
  activePeelLayer.noStroke();

  for (let r = brushSize; r > 0; r -= 6) {
    let a = map(r, brushSize, 0, 10, 255);
    activePeelLayer.fill(255, a);
    activePeelLayer.circle(mouseX, mouseY, r);
  }

  activePeelLayer.noErase();
}


function resetLayers() {
  glitch3Layer = createGraphics(imageSize, imageSize);
  glitch2Layer = createGraphics(imageSize, imageSize);
  glitch1Layer = createGraphics(imageSize, imageSize);

  glitch3Layer.image(celebImages[currentCeleb][0], 0, 0, imageSize, imageSize);
  glitch2Layer.image(celebImages[currentCeleb][1], 0, 0, imageSize, imageSize);
  glitch1Layer.image(celebImages[currentCeleb][2], 0, 0, imageSize, imageSize);

  peelState = [];

for (let x = 0; x < imageSize; x++) {
  peelState[x] = [];

  for (let y = 0; y < imageSize; y++) {
    peelState[x][y] = 0;
  }
}
}

function drawMenu() {
  fill(230);
  noStroke();
  rect(0, imageSize, width, menuHeight);

  fill(0);
  textSize(18);
  text("Drag on the image to peel back glitch layers", width / 2, imageSize + 20);

  textSize(22);
  text(celebNames[currentCeleb], width / 2, imageSize + 48);

  drawButtons();
}

function drawButtons() {
  let buttonW = 108;
  let buttonH = 35;
  let spacing = 8;
  let y = imageSize + 72;

  for (let i = 0; i < 5; i++) {
    let x = 10 + i * (buttonW + spacing);

    if (i === currentCeleb) {
      fill(160);
    } else {
      fill(255);
    }

    stroke(0);
    rect(x, y, buttonW, buttonH);

    fill(0);
    noStroke();
    textSize(11);
    text(celebNames[i], x + buttonW / 2, y + buttonH / 2);
  }
}

function checkButtons() {
  let buttonW = 108;
  let buttonH = 35;
  let spacing = 8;
  let y = imageSize + 72;

  for (let i = 0; i < 5; i++) {
    let x = 10 + i * (buttonW + spacing);

    if (
      mouseX > x &&
      mouseX < x + buttonW &&
      mouseY > y &&
      mouseY < y + buttonH
    ) {
      currentCeleb = i;
      resetLayers();
    }
  }
}
