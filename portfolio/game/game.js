// ===== Toolbar / UI =====
var canvasElement;
var toolButtons = [];
var toolbarDiv;
var selectedTool = "null";

// intro / win buttons
var easyBtn, mediumBtn, hardBtn, playAgainBtn;

// ===== Undo / Redo =====
var undoStack = [];
var redoStack = [];

// ===== Game state =====
var gameState = "intro";
var currentDifficulty = "";

// ===== Sudoku board =====
var board = [];
var fixedCells = [];
var solution = [];
var cellSize = 60;
var selectedRow = -1;
var selectedCol = -1;
var difficultyLabel;

// ===== Puzzle bank =====
var puzzles = {
  easy: {
    board: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 3, 0],
      [0, 0, 0, 6, 0, 0, 7, 9, 8],
      [0, 0, 1, 0, 8, 9, 0, 5, 0],
      [0, 4, 0, 2, 0, 1, 0, 6, 0],
      [0, 0, 0, 4, 7, 0, 2, 0, 0],
      [0, 0, 9, 0, 0, 8, 0, 0, 0],
      [0, 1, 3, 7, 6, 0, 0, 0, 5],
      [0, 0, 6, 0, 0, 0, 0, 1, 4]
    ],
    solution: [
      [5, 8, 7, 9, 3, 2, 1, 4, 6],
      [9, 6, 4, 8, 1, 7, 5, 3, 2],
      [1, 3, 2, 6, 4, 5, 7, 9, 8],
      [6, 2, 1, 3, 8, 9, 4, 5, 7],
      [7, 4, 8, 2, 5, 1, 3, 6, 9],
      [3, 9, 5, 4, 7, 6, 2, 8, 1],
      [4, 5, 9, 1, 2, 8, 6, 7, 3],
      [8, 1, 3, 7, 6, 4, 9, 2, 5],
      [2, 7, 6, 5, 9, 3, 8, 1, 4]
    ]
  },

  medium: {
    board: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 6, 3, 9, 7, 0],
      [0, 8, 0, 0, 2, 0, 0, 0, 5],
      [0, 0, 7, 3, 0, 5, 1, 6, 0],
      [0, 9, 5, 0, 1, 0, 0, 2, 0],
      [0, 0, 9, 0, 3, 0, 0, 5, 1],
      [0, 0, 2, 0, 5, 4, 8, 0, 0],
      [0, 0, 0, 8, 0, 0, 3, 0, 0]
    ],
    solution: [
      [9, 6, 4, 5, 7, 8, 2, 1, 3],
      [7, 1, 3, 2, 4, 9, 5, 8, 6],
      [2, 5, 8, 1, 6, 3, 9, 7, 4],
      [6, 8, 1, 9, 2, 7, 4, 3, 5],
      [4, 2, 7, 3, 8, 5, 1, 6, 9],
      [3, 9, 5, 4, 1, 6, 7, 2, 8],
      [8, 4, 9, 7, 3, 2, 6, 5, 1],
      [1, 3, 2, 6, 5, 4, 8, 9, 7],
      [5, 7, 6, 8, 9, 1, 3, 4, 2]
    ]
  },

    hard: {
    board: [
      [8, 0, 0, 0, 0, 0, 0, 0, 6],
      [4, 2, 7, 0, 0, 0, 1, 5, 3],
      [0, 1, 9, 5, 0, 2, 4, 7, 0],
      [0, 0, 1, 0, 9, 0, 6, 0, 0],
      [0, 0, 5, 3, 0, 6, 8, 0, 0],
      [0, 6, 0, 1, 0, 4, 0, 9, 0],
      [0, 0, 2, 0, 0, 0, 7, 0, 0],
      [0, 0, 0, 0, 7, 0, 0, 0, 0],
      [0, 0, 0, 8, 0, 1, 0, 0, 0]
    ],
    solution: [
      [8, 5, 3, 4, 1, 7, 9, 2, 6],
      [4, 2, 7, 6, 8, 9, 1, 5, 3],
      [6, 1, 9, 5, 3, 2, 4, 7, 8],
      [2, 3, 1, 7, 9, 8, 6, 4, 5],
      [9, 4, 5, 3, 2, 6, 8, 1, 7],
      [7, 6, 8, 1, 5, 4, 3, 9, 2],
      [3, 8, 2, 9, 4, 5, 7, 6, 1],
      [1, 9, 6, 2, 7, 3, 5, 8, 4],
      [5, 7, 4, 8, 6, 1, 2, 3, 9]
    ]
  }
};

function setup() {
  canvasElement = createCanvas(540, 540);
  canvasElement.position(170, 40);

  toolbarDiv = createDiv();
  toolbarDiv.position(10, 10);
  toolbarDiv.style("width", "140px");

  textAlign(CENTER, CENTER);
  textSize(20);

  createToolbar();
  createMenuButtons();
  showIntroButtons();
  hideWinButton();
  
  difficultyLabel = createDiv("");
  difficultyLabel.position(170, 10); // adjust as needed
  difficultyLabel.style("font-size", "16px");
  difficultyLabel.style("font-weight", "bold");
  difficultyLabel.hide();
}

function draw() {
  background(250);

  if (gameState == "intro") {
    drawIntroScreen();
  } else if (gameState == "play") {
    drawBoard();
    drawNumbers();
    drawSelection();

    fill(0);
    noStroke();
    textSize(16);
  } else if (gameState == "win") {
    drawWinScreen();
  }
}

// ===== Intro / Win Screens =====
function drawIntroScreen() {
  fill(0);
  textSize(28);
  text("Sudoku", width / 2, 120);

  textSize(18);
  text("Choose a difficulty", width / 2, 170);
}

function drawWinScreen() {
  fill(0, 150, 0);
  textSize(30);
  text("Puzzle Complete!", width / 2, 170);

  fill(0);
  textSize(18);
  text("You finished " + currentDifficulty + " mode", width / 2, 220);
}

// ===== Buttons =====
function createMenuButtons() {
  easyBtn = createButton("Easy");
  easyBtn.position(220, 240);
  easyBtn.size(100, 40);
  easyBtn.mousePressed(function() {
    startGame("easy");
  });

  mediumBtn = createButton("Medium");
  mediumBtn.position(220, 290);
  mediumBtn.size(100, 40);
  mediumBtn.mousePressed(function() {
    startGame("medium");
  });

  hardBtn = createButton("Hard");
  hardBtn.position(220, 340);
  hardBtn.size(100, 40);
  hardBtn.mousePressed(function() {
    startGame("hard");
  });

  playAgainBtn = createButton("Play Another Difficulty");
  var btnW = 180;
  var btnH = 40;

  var canvasX = canvasElement.position().x;
  var canvasY = canvasElement.position().y;

  playAgainBtn.size(btnW, btnH);
  playAgainBtn.position(
  canvasX + width / 2 - btnW / 2,
  canvasY + height / 2 - btnH / 2
);
  playAgainBtn.size(180, 40);
  playAgainBtn.mousePressed(function() {
    goToIntro();
  });
}

function showIntroButtons() {
  easyBtn.show();
  mediumBtn.show();
  hardBtn.show();
}

function hideIntroButtons() {
  easyBtn.hide();
  mediumBtn.hide();
  hardBtn.hide();
}

function showWinButton() {
  playAgainBtn.show();
}

function hideWinButton() {
  playAgainBtn.hide();
}

// ===== Game flow =====
function startGame(difficulty) {
  currentDifficulty = difficulty;
  loadPuzzle(difficulty);
  gameState = "play";
  hideIntroButtons();
  hideWinButton();
  difficultyLabel.html("Difficulty: " + difficulty);
  difficultyLabel.show();
  difficultyLabel.position(canvasElement.x, canvasElement.y - 25);
  selectedTool = null;
  updateToolbarStyles();
}

function goToIntro() {
  gameState = "intro";
  currentDifficulty = "";
  selectedRow = -1;
  selectedCol = -1;
  undoStack = [];
  redoStack = [];
  showIntroButtons();
  hideWinButton();
  difficultyLabel.hide();
  selectedTool = null;
  updateToolbarStyles();
}

// ===== Toolbar =====
function createToolbar() {
  var labels = [
    { key: "1", text: "1" },
    { key: "2", text: "2" },
    { key: "3", text: "3" },
    { key: "4", text: "4" },
    { key: "5", text: "5" },
    { key: "6", text: "6" },
    { key: "7", text: "7" },
    { key: "8", text: "8" },
    { key: "9", text: "9" },
    { key: "erase", text: "Erase" },
    { key: "undo", text: "Undo" },
    { key: "redo", text: "Redo" }
  ];

  var buttonW = 120;
  var buttonH = 28;
  var gap = 6;

  for (var i = 0; i < labels.length; i++) {
    var btn = createButton(labels[i].text);
    btn.parent(toolbarDiv);
    btn.size(buttonW, buttonH);
    btn.style("display", "block");
    btn.style("margin-bottom", gap + "px");
    btn.mousePressed(makeToolSetter(labels[i].key));
    toolButtons.push(btn);
  }

  updateToolbarStyles();
}

function makeToolSetter(value) {
  return function() {
    if (value == "undo") {
      undoMove();
    } else if (value == "redo") {
      redoMove();
    } else {
      selectedTool = value;
      updateToolbarStyles();
    }
  };
}

function updateToolbarStyles() {
  for (var i = 0; i < toolButtons.length; i++) {
    var label = toolButtons[i].html();

    if (label == selectedTool) {
      toolButtons[i].style("background-color", "#a0d8ff");
    } else if (label == "Erase" && selectedTool == "erase") {
      toolButtons[i].style("background-color", "#a0d8ff");
    } else {
      toolButtons[i].style("background-color", "");
    }
  }
}

// ===== Puzzle loading =====
function loadPuzzle(difficulty) {
  var sourceBoard = puzzles[difficulty].board;
  var sourceSolution = puzzles[difficulty].solution;

  board = [];
  solution = [];
  fixedCells = [];

  for (var r = 0; r < 9; r++) {
    board[r] = [];
    solution[r] = [];
    fixedCells[r] = [];

    for (var c = 0; c < 9; c++) {
      board[r][c] = sourceBoard[r][c];
      solution[r][c] = sourceSolution[r][c];
      fixedCells[r][c] = sourceBoard[r][c] !== 0;
    }
  }

  selectedRow = -1;
  selectedCol = -1;
  undoStack = [];
  redoStack = [];
}

// ===== Drawing =====
function drawBoard() {
  stroke(0);

  for (var r = 0; r <= 9; r++) {
    if (r % 3 == 0) {
      strokeWeight(4);
    } else {
      strokeWeight(1);
    }
    line(0, r * cellSize, width, r * cellSize);
  }

  for (var c = 0; c <= 9; c++) {
    if (c % 3 == 0) {
      strokeWeight(4);
    } else {
      strokeWeight(1);
    }
    line(c * cellSize, 0, c * cellSize, height);
  }
}

function drawNumbers() {
  textSize(24);

  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var value = board[r][c];

      if (value !== 0) {
        if (fixedCells[r][c]) {
          fill(20);
        } else {
          fill(0, 80, 180);
        }

        noStroke();
        text(
          value,
          c * cellSize + cellSize / 2,
          r * cellSize + cellSize / 2
        );
      }
    }
  }
}

function drawSelection() {
  if (selectedRow >= 0 && selectedCol >= 0) {
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    rect(selectedCol * cellSize, selectedRow * cellSize, cellSize, cellSize);
  }
}

// ===== Mouse input =====
function mousePressed() {
  if (gameState != "play") return;

  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    selectedCol = floor(mouseX / cellSize);
    selectedRow = floor(mouseY / cellSize);
    applySelectedTool();
  }
}

function applySelectedTool() {
  if (selectedRow < 0 || selectedCol < 0) return;
  if (fixedCells[selectedRow][selectedCol]) return;
  if (selectedTool === null) return;

  var oldValue = board[selectedRow][selectedCol];
  var newValue = oldValue;

  if (selectedTool == "erase") {
    newValue = 0;
  } else {
    newValue = int(selectedTool);
  }

  if (oldValue !== newValue) {
    saveMove(selectedRow, selectedCol, oldValue, newValue);
    board[selectedRow][selectedCol] = newValue;
    checkForWin();
  }
}

// ===== Undo / Redo =====
function saveMove(row, col, oldValue, newValue) {
  undoStack.push({
    row: row,
    col: col,
    oldValue: oldValue,
    newValue: newValue
  });

  redoStack = [];
}

function undoMove() {
  if (undoStack.length === 0 || gameState != "play") return;

  var move = undoStack.pop();
  board[move.row][move.col] = move.oldValue;
  redoStack.push(move);
}

function redoMove() {
  if (redoStack.length === 0 || gameState != "play") return;

  var move = redoStack.pop();
  board[move.row][move.col] = move.newValue;
  undoStack.push(move);
  checkForWin();
}

// ===== Win checking =====
function checkForWin() {
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) {
        return;
      }
    }
  }

  gameState = "win";
  showWinButton();
}
