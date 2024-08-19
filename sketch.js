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

  let calculated_cost = 0;
  let learnrate = 1;

  let x_current = 0;
  let y_current = 0;

  let x_normalized = 0;
  let y_normalized = 0;

  let output = 0;

  let classified_points = [];

  for (let x = 0; x < width; x += 5) {
    for (let y = 0; y < height; y += 3) {
      x_current = x;
      y_current = y;

      x_normalized = normalizeX(x_current);
      y_normalized = normalizeY(y_current);
      
      output = neuralnetwork.classify([x_normalized, y_normalized]);

      classified_points.push({ x, y, x_normalized, y_normalized, output });

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

  classified_points.forEach((point) => {
    neuralnetwork.learn(
      point.x_normalized,
      point.y_normalized,
      point.output,
      learnrate
    );
  });

  // need to make this fire every time the array is re-classified.
  updatePixels();

  const calcoutput = neuralnetwork.CalcOutputs([x_normalized, y_normalized]);
  calculated_cost += neuralnetwork.pointCost(
    calcoutput[0],
    calcoutput[1],
    output
  );

  updatePixels();

  setInterval(redrawer(), 5000);

  costLabel.textContent = `Cost: ${calculated_cost}`;

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
