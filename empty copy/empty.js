function setup() {
createCanvas(600, 600);
background(214, 168, 227)
}
function draw() {
if (mouseIsPressed) {
fill(0);
} else {
fill(255);
}
ellipse(mouseX, mouseY, 80, 80);
}
