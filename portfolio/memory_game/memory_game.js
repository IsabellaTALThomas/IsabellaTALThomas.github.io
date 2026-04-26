var gameState = "intro";

var roundNum = 1;
var maxRounds = 5;
var score = 0;
var lives = 3;

var items = [];
var targetIndex = -1;

var cols = 0;
var rows = 0;
var cellSize = 0;

var revealDuration = 0;
var revealStartTime = 0;
var revealPhase = true;

var retryRevealDuration = 2500;
var retryRevealStart = 0;
var showingRetryReveal = false;

var topMargin = 110;
var bottomMargin = 20;

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(240);

  if (gameState == "intro") {
    drawIntro();
  } else if (gameState == "play") {
    drawRound();
  } else if (gameState == "win") {
    drawWin();
  } else if (gameState == "lose") {
    drawLose();
  }
}

function drawIntro() {
  fill(0);
  textSize(30);
  text("Memory Star Game", width / 2, height / 2 - 80);

  textSize(18);
  text("Memorize the different star.", width / 2, height / 2 - 20);
  text("Then click where it was after all stars hide.", width / 2, height / 2 + 10);
  text("You have 3 lives.", width / 2, height / 2 + 40);
  text("Press any key to start.", width / 2, height / 2 + 90);

  if (keyIsPressed) {
    roundNum = 1;
    score = 0;
    lives = 3;
    startRound(roundNum);
    gameState = "play";
  }
}

function drawWin() {
  background(180, 230, 180);

  fill(0);
  textSize(32);
  text("You Win!", width / 2, height / 2 - 40);

  textSize(20);
  text("Score: " + score + " / " + maxRounds, width / 2, height / 2 + 5);
  text("Press any key to play again", width / 2, height / 2 + 50);

  if (keyIsPressed) {
    gameState = "intro";
  }
}

function drawLose() {
  background(230, 180, 180);

  fill(0);
  textSize(32);
  text("Game Over", width / 2, height / 2 - 40);

  textSize(20);
  text("Press any key to try again", width / 2, height / 2 + 20);

  if (keyIsPressed) {
    gameState = "intro";
  }
}

function startRound(currentRound) {
  items = [];
  showingRetryReveal = false;

  if (currentRound == 1) {
    cols = 4;
    rows = 4;
    revealDuration = 2400;
  } else if (currentRound == 2) {
    cols = 5;
    rows = 4;
    revealDuration = 2300;
  } else if (currentRound == 3) {
    cols = 5;
    rows = 5;
    revealDuration = 2200;
  } else if (currentRound == 4) {
    cols = 6;
    rows = 5;
    revealDuration = 2100;
  } else if (currentRound == 5) {
    cols = 6;
    rows = 6;
    revealDuration = 2000;
  }

  cellSize = min(width / cols, (height - topMargin - bottomMargin) / rows);

  var boardW = cols * cellSize;
  var boardH = rows * cellSize;
  var offsetX = (width - boardW) / 2;
  var offsetY = topMargin + ((height - topMargin - bottomMargin) - boardH) / 2;

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      items.push({
        x: offsetX + c * cellSize + cellSize / 2,
        y: offsetY + r * cellSize + cellSize / 2
      });
    }
  }

  targetIndex = floor(random(items.length));
  revealStartTime = millis();
  revealPhase = true;
}

function drawRound() {
  drawHUD();

  if (showingRetryReveal) {
    if (millis() - retryRevealStart > retryRevealDuration) {
      showingRetryReveal = false;
      revealPhase = false;
    }
  } else if (revealPhase && millis() - revealStartTime > revealDuration) {
    revealPhase = false;
  }

  for (var i = 0; i < items.length; i++) {
    if (revealPhase || showingRetryReveal) {
      if (i == targetIndex) {
        drawSpecialStar(items[i].x, items[i].y, cellSize * 0.32);
      } else {
        drawNormalStar(items[i].x, items[i].y, cellSize * 0.32);
      }
    } else {
      drawHiddenStar(items[i].x, items[i].y, cellSize * 0.32);
    }
  }

  fill(20);
  textSize(16);

  if (showingRetryReveal) {
    text("Wrong guess! Look again.", width / 2, height - 20);
  } else if (revealPhase) {
    text("Memorize the slightly different star", width / 2, height - 20);
  } else {
    text("Click where it was", width / 2, height - 20);
  }
}

function drawHUD() {
  fill(0);
  textSize(22);
  text("Round " + roundNum + " / " + maxRounds, width / 2, 25);

  textSize(18);
  text("Score: " + score, width / 2, 55);

  drawLives();
}

function drawLives() {
  for (var i = 0; i < lives; i++) {
    drawHeart(width / 2 - 35 + i * 35, 85, 14);
  }
}

//lives display
function drawHeart(x, y, s) {
  fill(255, 0, 80);
  noStroke();
  ellipse(x - s / 2, y, s, s);
  ellipse(x + s / 2, y, s, s);
  triangle(x - s, y, x + s, y, x, y + s * 1.6);
}

function mousePressed() {
  if (gameState != "play") return;
  if (revealPhase || showingRetryReveal) return;

  for (var i = 0; i < items.length; i++) {
    var d = dist(mouseX, mouseY, items[i].x, items[i].y);

    if (d < cellSize * 0.22) {
      if (i == targetIndex) {
        score++;

        if (roundNum < maxRounds) {
          roundNum++;
          startRound(roundNum);
        } else {
          gameState = "win";
        }
      } else {
        lives--;

        if (lives <= 0) {
          gameState = "lose";
        } else {
          showingRetryReveal = true;
          retryRevealStart = millis();
        }
      }
      break;
    }
  }
}

function drawNormalStar(x, y, size) {
  push();
  translate(x, y);

//star body
  fill(255, 215, 0);
  stroke(0);
  strokeWeight(1);
  star(0, 0, size * 0.48, size, 5);

//eyes
  fill(0);
  noStroke();
  ellipse(-size * 0.18, -size * 0.08, size * 0.08, size * 0.08);
  ellipse(size * 0.18, -size * 0.08, size * 0.08, size * 0.08);


//happy mouth
  noFill();
  stroke(0);
  strokeWeight(1);
  arc(0, size * 0.12, size * 0.30, size * 0.18, 0, PI);

  pop();
}

function drawSpecialStar(x, y, size) {
  push();
  translate(x, y);

  fill(255, 215, 0);
  stroke(0);
  strokeWeight(1);
  star(0, 0, size * 0.48, size, 5);

//eyes
  fill(0);
  noStroke();
  ellipse(-size * 0.18, -size * 0.08, size * 0.08, size * 0.08);
  ellipse(size * 0.18, -size * 0.08, size * 0.08, size * 0.08);

// frowning eyebrows
  stroke(0);
  strokeWeight(2);
  line(-size * 0.28, -size * 0.18, -size * 0.10, -size * 0.12);
  line(size * 0.10, -size * 0.12, size * 0.28, -size * 0.18);

//sad mouth
  noFill();
  stroke(0);
  strokeWeight(1);
  arc(0, size * 0.16, size * 0.22, size * 0.10, PI, TWO_PI);

  pop();
}

function drawHiddenStar(x, y, size) {
  push();
  translate(x, y);

//hidden star body gray
  fill(180);
  stroke(120);
  strokeWeight(1);
  star(0, 0, size * 0.48, size, 5);

  pop();
}

function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle / 2.0;
  beginShape();

  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);

    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }

  endShape(CLOSE);
}
