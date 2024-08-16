// hidden and output layers
// copoied and pasted form nextork.js
// new neuralNetwork(2, 3, 2);
// 2 inputs, 6, weights, 6 weights, 2 outputs, 5 biases
const graphWidth = 954;
const graphHeight = 476;

function normalizeX(input) {
  const normalized = input / (graphWidth / 2);

  return normalized;
}

function normalizeY(input) {
  const normalized = input / (graphHeight / 2);

  return normalized;
}

let safePoints;
let unsafePoints;

function preload() {
  safePoints = loadJSON("./safepoints.json");
  unsafePoints = loadJSON("./unsafepoints.json");
}

const neuralnetwork = new NeuralNetwork(2, 3, 2);
const inputs = [0.4, 0.2];

function setup() {
  createCanvas(graphWidth, graphHeight);
}

const costLabel = document.createElement("label");
document.body.appendChild(costLabel);
costLabel.id = "costLabel";
costLabel.textContent = "Cost: 0.0";

function draw() {
  background("white");

  loadPixels();
  translate(0, height);
  scale(1, -1);

  for (let x = 0; x < width; x += 3) {
    for (let y = 0; y < height; y += 1) {
      // normalize width and heights
      const normalizedX = normalizeX(x);
      const normalizedY = normalizeY(y);

      const output = neuralnetwork.classify([normalizedX, normalizedY]);

      let index = (x + y * width) * 4;
      if (output === 0) {
        pixels[index] = 0;
        pixels[index + 1] = 0;
        pixels[index + 2] = 255; // blue
      } else {
        pixels[index] = 255; // red
        pixels[index + 1] = 0;
        pixels[index + 2] = 0;
      }
      pixels[index + 3] = 255;
    }
  }

  updatePixels();

  for (let i = 0; i < 49; i++) {
    const point = safePoints[i];
    const x = point.x;
    const y = point.y;

    push();
    fill("blue");
    stroke("blue");
    circle(x, y, 10);
    pop();
  }

  for (let i = 0; i < 49; i++) {
    const point = unsafePoints[i];
    const x = point.x;
    const y = point.y;

    push();
    stroke("red");
    fill("red");
    circle(x, y, 10);
    pop();
  }

  stroke("black");
  fill("none");
  circle(0, 0, 50);

  push();
  fill("black");
  scale(1, -1);
  textSize(20);
  text("(0,0)", 50, -20);
  pop();
}
