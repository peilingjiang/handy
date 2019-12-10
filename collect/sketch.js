const debug = true;

let cnv; // the canvas

let page_stage; // 'home' 'page1' 'page2'
let collecting = false; // Imply the data is being added to Neural Network
let modelTrained = false; // Imply the model is trained

let channel_1_all = [];
let channel_2_all = [];
let channel_3_all = [];
let channel_4_all = [];

let type = null;

// Open and connect socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function () {
    console.log("Connected");
});

let brain_idle; // All channels
let brain_scroll; // Channel 1-2
let brain_zoom; // Channel 3-4
let brain_num; // Channel 3-4

const options_idle = {
    inputs: 12, /* 3 for each, 4 channels*/
    outputs: 2, /* idle / not */
    task: 'classification',
    debug: true
};

const options_scroll = {
    inputs: 6, /* Every channel: delta (abs, compared to the last number), delta (abs, compared to the [-12] number), standard deviation (last 12) */
    outputs: 2, /* up down */
    task: 'classification',
    debug: true
};

const options_zoom = {
    inputs: 6, /* 3 for each, 2 channels, 3-4*/
    outputs: 2, /* in / out */
    task: 'classification',
    debug: true
};

const options_num = {
    inputs: 6, /* 3 for each, 2 channels, 3-4*/
    outputs: 4, /* 1/3/7/9 */ // TODO: more numbers
    task: 'classification',
    debug: true
};

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