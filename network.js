// safepoints.json
// {
//     "x": 404.1666785693151,
//     "y": 118.40649631550002
// },
// to calculate cost, we take the neuralnetworks output array, maybe [0.2349, 0.2698] and use the maxvalueindex to find the greater value, in this case the greater value is an index 1.
// therefore to calculate the cost at this singular datapoint, we perform new Datapoint(x, y, 1, 2);
// this is because we take the coords of the point, and the safety status of the point, the neural network is most confident that the value at index 1 is the correct answer, and thus subs it in.
// the nodecost of this value is the expected output (1), and its activation output (0.2698);

let safePoints = [];
let unsafePoints = [];

let weighted_safePoints = [];
let weighted_unsafePoints = [];

safePoints = fetchPoints('safepoints.json').then(points => {
    const safe_points = points.map(point => {
        const classificated = neuralnetwork.CalcOutputs([normalizeX(point.x), normalizeY(point.y)]);
        weighted_safePoints.push(classificated);

        return classificated;
    });
    
    return safe_points;
});


unsafePoints = fetchPoints('unsafepoints.json').then(points => {
    const unsafe_points = points.map(point => {
        const classificated = neuralnetwork.CalcOutputs([normalizeX(point.x), normalizeY(point.y)]);
        weighted_unsafePoints.push(classificated);

        return classificated;
    });

    return unsafe_points;
});

async function fetchPoints(points) {
    const res = await fetch(`http://localhost:3000/${points}`)
    const body = await res.json();
        
    return body;
}

class Layer {
    // number of nodes into the layer is the number of connections of the nodes inside the current layer, for example 2,3 will have 2 nodes and 3 outgoing nodes,
    // so it will be an array of
    number_of_nodes_into_the_layer = 0;

    // number of nodes in the actual layer, setting to 3 will mean there are 3 nodes
    number_of_outgoing_nodes = 0;

      // create a loop to append slider nodes to the DOM.
      // 2D (n-th dimensional, a K-th dimensional input matrix would correspond to a K by 1 hidden layer weight matrix )
    weights = [];
    //1D
    biases = [];

    cost_gradientW = [];
    cost_gradientB = [];

    constructor(nodesIn, nodesOut) {
        this.number_of_nodes_into_the_layer = nodesIn;
        this.number_of_outgoing_nodes = nodesOut;

        this.biases = new Array(nodesOut);

        // weights
        for (let i = 0; i < nodesIn; i++) {

            // for a 2,3,2 matrix, this will take 2 nodes in, and 3 nodes out
            // this will initialize a [[w11, w12, w13], [w21, w22, w23]] a 2 element array of 3 element arrays
            this.weights[i] = new Array(nodesOut);
            
            for (let j = 0; j < nodesOut; j++) {
                this.weights[i][j] = Math.random();

                const weightSlider = document.getElementById(`weight-${i}-${j}`);
                
                if (weightSlider) {
                    weightSlider.value = this.weights[i][j];
                }
            }
        }
        for (let i = 0; i < nodesIn; i++) {
            this.cost_gradientW[i] = new Array(nodesOut);
        }

        // biases
        for (let i = 0; i < nodesOut; i++) {
            this.biases[i] = Math.random();

            const biasSlider = document.getElementById(`bias-${i}`);
            
            if (biasSlider) {
                biasSlider.value = this.biases[i];
            }
        }
        this.cost_gradientB = new Array(nodesOut)
    }

    // softmax sums to one, it is good for classification, maybe I should read some more about this :-)
    softmax(logits) {
        const maxLogit = Math.max(...logits);
        const expLogits = logits.map(logit => Math.exp(logit - maxLogit));
        const sumExpLogits = expLogits.reduce((a, b) => a + b, 0);
        return expLogits.map(expLogit => expLogit / sumExpLogits);
    }

    sigmoid(input) {
        return 1 / (1 + Math.exp(-input));
    }

    // calc stands for calculate btw
    // takes in an array
    calcOutputs(inputs) {
    // outputs = weights[i] * input[i] + bias (of the current node)
    // the number of weighted outputs corresponds to the number of output nodes (figure 7.2)
    const weighted_outputs = new Array(this.number_of_outgoing_nodes);

    for (let i = 0; i < this.number_of_outgoing_nodes; i++) {
        let weighted_output_sum = 0;

        for (let j = 0; j < this.number_of_nodes_into_the_layer; j++) {
            weighted_output_sum += inputs[j] * this.weights[j][i];
        }

            weighted_output_sum += this.biases[i];
            weighted_outputs[i] = weighted_output_sum;
        }

        return this.softmax(weighted_outputs);
    }

    // LOSS FUNCTION
    // cross entropy function
    nodeCost(outputActivation, expectedOutput) {
        if (outputActivation === 0) outputActivation = 1e-10;
        if (outputActivation === 1) outputActivation = 1 - 1e-10;
        return - (expectedOutput * Math.log(outputActivation) + (1 - expectedOutput) * Math.log(1 - outputActivation));
    }
    

    // nodeCost(outputActivation, expectedOutput) {
    //     return 0.5 * Math.pow((outputActivation - expectedOutput), 2);
    // }

    update_gradients(learnrate) {
        for (let i = 0; i < this.number_of_outgoing_nodes; i++) {
            this.biases[i] -= this.cost_gradientB[i] * learnrate;

            for (let j = 0; j < this.number_of_nodes_into_the_layer; j++) {
                this.weights[j][i] -= this.cost_gradientW[j][i] * learnrate;
            }
        }
    }
}

// new Layer(2,3)
// [[0,0,0],[0,0,0]]
//

//interface to communicate with the layer
class NeuralNetwork {
    layers = [];

    // if this were typescript EVERYTHING would be numbers
    constructor(...layers) {
        this.layers = [];
        
        for (let i = 0; i < layers.length - 1; i++) {
            this.layers[i] = new Layer(layers[i], layers[i + 1]);
        }

        // apply the activation function (sigmoid, or the one-zero classify, tanh, etc)) by looping through each node in the hidden layer (see line 51, each array of [0,0,0] is a node, a neuron)
        // do this by calling calcOutputs and substituting calc outputs into the sigmoid function (equation 7.8) \sigma(calcOutputs(inputs))
    }

    CalcOutputs(inputs) {
        this.layers.forEach((layer) => {
            inputs = layer.calcOutputs(inputs);
        });
        
        return inputs;
    }

    maxvalueindex(values) {
        let maxValue = -Infinity;
        let index = 0;

        values.forEach((value, i) => {
            if (value > maxValue) {
                maxValue = value;
                index = i;
            }
        });

        return index;
    }

    classify(inputs) {
        const outputs = this.CalcOutputs(inputs);
        return this.maxvalueindex(outputs);
    }

    apply_all_gradients(learnrate) {
        this.layers.forEach(layer => {
            layer.update_gradients(learnrate);
        });
    }

    // x y should already be normalized
    pointCost(x, y, classification) {
        const outputs = this.CalcOutputs([x, y]);        
        const points = classification === 0 ? weighted_safePoints : weighted_unsafePoints;
        
        const nearest_point = nearestpoint(x, y, points);
        let _cost = 0;


        for (let i = 0; i < outputs.length; i++) {
            _cost += this.layers[this.layers.length - 1].nodeCost(outputs[i], points[nearest_point][i]);
        }

        return _cost;
    }

    learn(x, y, classification, learnrate) {
        // lim h->0
        const h = 0.01;
        let original_cost = this.pointCost(x, y, classification);

        this.layers.forEach((layer) => {
            for (let i = 0; i < layer.number_of_outgoing_nodes; i++) {
                for (let j = 0; j < layer.number_of_nodes_into_the_layer; j++) {
                    layer.weights[j][i] += h;
                    let delta_cost = this.pointCost(x, y, classification) - original_cost;

                    layer.cost_gradientW[j][i] = delta_cost / h;

                }
            }

            for (let i = 0; i < layer.biases.length; i++) {
                layer.biases[i] += h;

                let delta_cost = this.pointCost(x, y, classification) - original_cost;
                layer.biases[i] -= h;
                layer.cost_gradientB[i] = delta_cost / h;
            }
        })

        this.apply_all_gradients(learnrate);
    }
}

// we must pass these datapoints THROUGH the neural network, and save it
const neuralnetwork = new NeuralNetwork(2, 3, 2);


// now, when passing the graph x y coordinates through the neural network, the distance from the nearest weighted_safePoint or weighted_unsafePoint depending on 
// the neuralnetworks choice of classification based upon maxValueIndex() shall be checked.
// then, with the nearest safePoint or unsafePoint, pointCost can be calculated, where the input is the x,y coordinate of the current point, and the expectedOutput is the 
// safePoint or unsafePoint nearest to the x,y point.

// pass values through the neural network