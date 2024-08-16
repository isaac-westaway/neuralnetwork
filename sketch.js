// hidden and output layers
// copoied and pasted form nextork.js
// new neuralNetwork(2, 3, 2);
// 2 inputs, 6, weights, 6 weights, 2 outputs, 5 biases

let safeGraphPoints;
let unsafeGraphPoints;

function preload() {
  safeGraphPoints = loadJSON("./safepoints.json");
  unsafeGraphPoints = loadJSON("./unsafepoints.json");
}

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

      const calcoutput = neuralnetwork.CalcOutputs([normalizedX, normalizedY])

      let calculated_cost = 0;
      
      calculated_cost += neuralnetwork.pointCost(calcoutput[0], calcoutput[1], output)
      // cost is inserted here
      costLabel.textContent = `Cost: ${calculated_cost}`


      let index = (x + y * width) * 4;
      if (output === 0) {
        pixels[index] = 0;
        pixels[index + 1] = 0;
        pixels[index + 2] = 255; // blue safe
      } else {
        pixels[index] = 255; // red unsafe
        pixels[index + 1] = 0;
        pixels[index + 2] = 0;
      }
      pixels[index + 3] = 255;
    }
  }

  updatePixels();

  for (let i = 0; i < 49; i++) {
    const point = safeGraphPoints[i];
    const x = point.x;
    const y = point.y;

    push();
    fill("blue");
    stroke("blue");
    circle(x, y, 10);
    pop();
  }

  for (let i = 0; i < 49; i++) {
    const point = unsafeGraphPoints[i];
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
