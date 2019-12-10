const debug = true;

// Open and connect socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function () {
    console.log("Connected");
});

let brain_scroll;

const options_scroll = {
    inputs: 2, /* Every channel: pure number, delta (absolute), standard deviation (last 10) */
    outputs: 2, /* idle up down */
    task: 'classification',
    debug: true
}

var counter = 0;

// ------ SETUP ------

function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    page_stage = 'home';

    brain_scroll = ml5.neuralNetwork(options_scroll);

    // Collect data here directly
    socket.on('channeldata', function (data) {

        counter++;
        // Up to 4 channels

        // channel_data = [
        //     data.channel_1 * 600000
        // ];

        channel_1_all.push(data.channel_1 * 500000);

        // if (counter % 120 == 0 && !collecting && !modelTrained && debug) {
        //     console.log('Receiving... ', channel_data);
        // }

        if (keyIsDown(67)) {
            // C pressed
            // Collect data
            addExample();
            collecting = true;
        } else {
            collecting = false;
        }
    });
}

function addExample() {
    if (type != null) {
        let num_1 = channel_1_all[channel_1_all.length - 1]; // Not added into model
        let delta_1 = get_delta(channel_1_all);
        let sd_1 = get_sd(channel_1_all, 15);
        brain_scroll.addData([delta_1, sd_1], [type]);
        if (debug) {
            console.log('Collecting... ', [num_1, delta_1, sd_1], [type]);
        }
    }
}

function trainModel() {
    if (debug) {
        // console.log('Channel 1_ ', channel_1_all);
        // console.log('Channel 2_ ', channel_2_all);
    }
    brain_scroll.normalizeData();
    console.log(brain_scroll);

    const trainingOptions_scroll = {
        batchSize: 64,
        epochs: 300,
        hiddenUnits: 16
    }

    brain_scroll.train(trainingOptions_scroll, finishedTraining);
}

function finishedTraining() {
    console.log('Training done!');
    console.log(brain_scroll);
    modelTrained = true;
    predict();
}

function predict() {
    console.log('Predicting...');
    brain_scroll.predict([get_delta(channel_1_all), get_sd(channel_1_all, 15)], gotResult);
}

function gotResult(error, outputs) {
    if (error) {
        console.error(error);
        return;
    }
    console.log(outputs[0].label);
    if (outputs[0].label == 'down') {
        window.scrollBy(0, 6);
    }
    // let scroll = outputs.value;
    predict();
}

function draw() {
    if (page_stage == "home") {
        cnv.hide();
    }

    if (keyIsDown(85)) {
        // U pressed
        type = 'up'; // UP
    } else if (keyIsDown(68)) {
        // D pressed
        type = 'down'; // DOWN
    } else if (keyIsDown(73)) {
        // I pressed
        type = 'idle'; // IDLE
    }

}

function keyPressed() {
    if (keyCode === 84) {
        // T pressed
        trainModel();
    }

    return false;
}