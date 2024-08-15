// hidden and output layers
class Layer {
    number_of_nodes_into_the_layer = 0;
    number_of_outgoing_nodes = 0;

    // create a loop to append slider nodes to the DOM.
    // 2D (n-th dimensional, a K-th dimensional input matrix would correspond to a K by 1 hidden layer weight matrix )
    weights = [];

    //1D
    biases = [];

    constructor(nodesIn, nodesOut) {
        this.number_of_nodes_into_the_layer = nodesIn;
        this.number_of_outgoing_nodes = nodesOut;

        this.biases = new Array(nodesOut);

        for (let i = 0; i < nodesIn; i++) {
            this.weights[i] = new Array(nodesOut);
            for (let j = 0; j < nodesOut; j++) {
                this.weights[i][j] = Math.random();

                const weightSlider = document.getElementById(`weight-${i}-${j}`);

                if (weightSlider) {
                    weightSlider.value = this.weights[i][j];
                }
            }
        }

        for (let i = 0; i < nodesOut; i++) {
            this.biases[i] = Math.random();

            const biasSlider = document.getElementById(`bias-${i}`);

            if (biasSlider) {
                biasSlider.value = this.biases[i];
            }
        }

        // sliders [weights]
        for (let i = 0; i < nodesIn; i++) {
            for (let j = 0; j < nodesOut; j++) {
                const container = document.createElement("div");
                container.classList.add("slider-item");

                const input = document.createElement("input");
                input.classList.add("row");
                input.type = "range";
                input.min = -1;
                input.max = 1;
                input.step = 0.01;
                input.id = `weight-${i}-${j}`;

                const label = document.createElement("label");
                label.textContent = `w${i}-${j}`;

                container.appendChild(label);
                container.appendChild(input);
                document.body.appendChild(container);

                input.addEventListener("input", (event) => {
                    this.weights[i][j] = parseFloat(event.target.value);
                });
            }
        }

        // sliders [biasees]
        for (let i = 0; i < this.biases.length; i++) {
            const container = document.createElement("div");
            container.classList.add("slider-item");

            const input = document.createElement("input");
            input.classList.add("row");
            input.type = "range";
            input.min = -1;
            input.max = 1;
            input.step = 0.01;
            input.id = `bias-${i}`;

            const label = document.createElement("label");
            label.textContent = `b${i}`;

            container.appendChild(label);
            container.appendChild(input);
            document.body.appendChild(container);

            input.addEventListener("input", (event) => {
                this.biases[i] = parseFloat(event.target.value);
            });
        }
    }

    // calc stands for calculate btw
    // takes in an array
    // activation function enters HERE
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

        return weighted_outputs;
        }
}

// new Layer(2,3)
// [[0,0,0],[0,0,0]]
//

//interface to communicate with the layer
class NeuralNetwork {
    layers = [];

    // should update to a variadic function, such that it can accept an unlimited amount of hidden layers
    // if this were typescript EVERYTHING would be numbers
    constructor(...layers) {
        this.layers = [];

        this.layers = [];
        for (let i = 0; i < layers.length - 1; i++) {
            this.layers[i] = new Layer(layers[i], layers[i + 1]);
        }

        // apply the activation function (sigmoid, or the one-zero classify, tanh, etc)) by looping through each node in the hidden layer (see line 51, each array of [0,0,0] is a node, a neuron)
        // do this by calling calcOutputs and substituting calc outputs into the sigmoid function (equation 7.8) \sigma(calcOutputs(inputs))

        console.log(this.layers);
    }

    CalcOutputs(inputs) {
        this.layers.forEach((layer) => {
            inputs = layer.calcOutputs(inputs);
        });
        // the activation function is applied HERE
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
}
