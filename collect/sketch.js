const debug = true;

// NOW 4-4-3

let cnv; // the canvas
let saveCounter = 0;
let trainCounter = 0;

let page_stage; // 'home' 'page1' 'page2'
let collecting = false; // Imply the data is being added to Neural Network
let modelTrained_idle = false; // Imply the model is trained
let modelTrained_scroll = false;
let modelTrained_zoom = false;
let modelTrained_num = false;

let channel_1_all = [];
let channel_2_all = [];
let channel_3_all = [];
let channel_4_all = [];

let type = null;

// Open and connect socket
let socket = io();

// Listen for confirmation of connection
socket.on("connect", function () {
    console.log("Connected");
});

let brain_idle; // All channels
let brain_scroll; // Channel 1-3
let brain_zoom; // Channel 2-4
let brain_num; // Channel 3-4

/*
Data Structure passed into each model:
    For each channel (up to 4):
        delta (abs, compared to the last number),
        delta (abs, compared to the [-12] number),
        standard deviation (last 12 numbers)
*/

let amplifier = 500000;

const options_idle = {
    inputs: 12 /* 3 for each, 4 channels*/,
    outputs: 2 /* idle / not */,
    task: "classification",
    debug: debug
};

const options_scroll = {
    inputs: 12 /* 3 for each, 2 channels, 1-2 */,
    outputs: 3 /* up idle down */,
    task: "classification",
    debug: debug
};

const options_zoom = {
    inputs: 9 /* 3 for each, 2 channels, 2-4*/,
    outputs: 3 /* in idle out */, /* Zoom in large, zoom out small */
    task: "classification",
    debug: denug
};

const options_num = {
    inputs: 6 /* 3 for each, 2 channels, 3-4*/,
    outputs: 4 /* 1/3/7/9 */, // TODO: more numbers
    task: "classification",
    debug: debug
};

// ----------------------------------- SETUP -----------------------------------

function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    page_stage = "home";

    // Init brains
    brain_idle = ml5.neuralNetwork(options_idle);
    brain_scroll = ml5.neuralNetwork(options_scroll);
    brain_zoom = ml5.neuralNetwork(options_zoom);
    brain_num = ml5.neuralNetwork(options_num);

    // ---------- Collect data here directly ----------
    socket.on("channeldata", function (data) {
        // Up to 4 channels
        channel_1_all.push(data.channel_1 * amplifier);
        channel_2_all.push(data.channel_2 * amplifier);
        channel_3_all.push(data.channel_3 * amplifier);
        channel_4_all.push(data.channel_4 * amplifier);

        // if (counter % 120 == 0 && !collecting && !modelTrained && debug) {
        //     console.log('Receiving... ', channel_data);
        // }

        if (keyIsDown(67)) {
            // C pressed
            // Collect data
            addExample(channel_1_all, channel_2_all, channel_3_all, channel_4_all);
            collecting = true;
        } else {
            collecting = false;
        }
    });
}

function addExample(c_1_all, c_2_all, c_3_all, c_4_all) {
    // Model idle
    if (type === 'idle') {
        // let num_1 = channel_1_all[channel_1_all.length - 1]; // Not added into model
        // let delta_1 = get_delta(channel_1_all);
        // let delta12_1 = get_delta12(channel_1_all);
        // let sd_1 = get_sd(channel_1_all, 12);
        brain_idle.addData([
            get_delta(c_1_all), get_delta12(c_1_all), get_sd(c_1_all, 12),
            get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
            get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
            get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
        ], ['idle']);
        brain_scroll.addData([
            get_delta(c_1_all), get_delta12(c_1_all), get_sd(c_1_all, 12),
            get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
            get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
            get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
        ], ['idle']);
        brain_zoom.addData([
            get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
            get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
            get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
        ], ['idle']);
    } else if (type != null) {
        // Also collect into not idle
        brain_idle.addData([
            get_delta(c_1_all), get_delta12(c_1_all), get_sd(c_1_all, 12),
            get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
            get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
            get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
        ], ['not']);

        if (type === 'up' || type === 'down') {
            // Model scroll collect data, 1-2
            brain_scroll.addData([
                get_delta(c_1_all), get_delta12(c_1_all), get_sd(c_1_all, 12),
                get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
                get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
                get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
            ], [type]);
        } else if (type === 'in' || type === 'out') {
            // Model zoom collect data, 3-4
            brain_zoom.addData([
                get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
                get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
                get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
            ], [type]);
        } else if (type === 'one' || type === 'two' || type === 'three' || type === 'four') {
            brain_num.addData([
                get_delta(c_1_all), get_delta12(c_1_all), get_sd(c_1_all, 12),
                get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
                get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
                get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
            ], [type]);
        }
    }
    if (type != null && debug) {
        console.log("Collecting... ", type);
    }
}

/*--------------------------- IDLE ---------------------------*/

function trainModel_idle() {
    brain_idle.normalizeData();
    const trainingOptions_idle = {
        batchSize: 128,
        epochs: 500,
        hiddenUnits: 48
    }
    brain_idle.train(trainingOptions_idle, finishedTraining_idle);
}

function finishedTraining_idle() {
    modelTrained_idle = true;
    predict_idle();
}

function predict_idle() {
    if (!modelTrained_scroll) {
        brain_idle.predict([
            get_delta(channel_1_all), get_delta12(channel_1_all), get_sd(channel_1_all, 12),
            get_delta(channel_2_all), get_delta12(channel_2_all), get_sd(channel_2_all, 12),
            get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
            get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12)
        ], gotResult_idle);
    }
}

function gotResult_idle(error, outputs) {
    if (error) {
        console.log('IDLE PREDICT ERROR');
        console.error(error);
        return;
    }
    console.log(outputs[0].label);
    predict_idle();
}

/*--------------------------- SCROLL ---------------------------*/

function trainModel_scroll() {
    if (debug) {
        // console.log('Channel 1_ ', channel_1_all);
        // console.log('Channel 2_ ', channel_2_all);
    }
    brain_scroll.normalizeData();
    // console.log(brain_scroll);
    const trainingOptions_scroll = {
        batchSize: 64,
        epochs: 500,
        hiddenUnits: 32
    };
    brain_scroll.train(trainingOptions_scroll, finishedTraining_scroll);
}

function finishedTraining_scroll() {
    console.log("Scroll training done!");
    console.log('SCROLL ', brain_scroll);
    modelTrained_scroll = true;
    predict_scroll();
}

function predict_scroll() {
    // console.log("Predicting...");
    if (!modelTrained_zoom) {
        brain_scroll.predict([
            get_delta(channel_1_all), get_delta12(channel_1_all), get_sd(channel_1_all, 12),
            get_delta(channel_2_all), get_delta12(channel_2_all), get_sd(channel_2_all, 12),
            get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
            get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12)
        ], gotResult_scroll);
    }
}

function gotResult_scroll(error, outputs) {
    if (error) {
        console.log('SCROLL PREDICT ERROR');
        console.error(error);
        return;
    }
    console.log(outputs[0].label);
    // if (outputs[0].label == "down") {
    //     window.scrollBy(0, 7);
    // }
    predict_scroll();
}

/*--------------------------- ZOOM ---------------------------*/

function trainModel_zoom() {
    brain_zoom.normalizeData();
    const trainingOptions_zoom = {
        batchSize: 64,
        epochs: 500,
        hiddenUnits: 32
    };
    brain_zoom.train(trainingOptions_zoom, finishedTraining_zoom);
}

function finishedTraining_zoom() {
    console.log('ZOOM ', brain_zoom);
    modelTrained_zoom = true;
    predict_zoom();
}

function predict_zoom() {
    // console.log("Predicting...");
    brain_zoom.predict([
        get_delta(channel_2_all), get_delta12(channel_2_all), get_sd(channel_2_all, 12),
        get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
        get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12),
    ], gotResult_zoom);
}

function gotResult_zoom(error, outputs) {
    if (error) {
        console.log('ZOOM PREDICT ERROR');
        console.error(error);
        return;
    }
    console.log(outputs[0].label);
    predict_zoom();
}

/*--------------------------- NUM ---------------------------*/

function trainModel_num() {
    brain_num.normalizeData();
    const trainingOptions_num = {
        batchSize: 64,
        epochs: 500,
        hiddenUnits: 32
    };
    brain_num.train(trainingOptions_num, finishedTraining_num);
}

function finishedTraining_num() {
    console.log('NUM ', brain_num);
    modelTrained_num = true;
    predict_num();
}

function predict_num() {
    // console.log("Predicting...");
    brain_num.predict([
        get_delta(c_1_all), get_delta12(c_1_all), get_sd(c_1_all, 12),
        get_delta(c_2_all), get_delta12(c_2_all), get_sd(c_2_all, 12),
        get_delta(c_3_all), get_delta12(c_3_all), get_sd(c_3_all, 12),
        get_delta(c_4_all), get_delta12(c_4_all), get_sd(c_4_all, 12)
    ], gotResult_num);
}

function gotResult_num(error, outputs) {
    if (error) {
        console.log('NUM PREDICT ERROR');
        console.error(error);
        return;
    }
    console.log(outputs[0].label);
    predict_num();
}





// ----------------------------------- DRAW -----------------------------------

function draw() {
    if (page_stage == "home") {
        cnv.hide();
    }
}

function keyPressed() {
    // TYPE
    if (key === "u") {
        type = "up";
    } else if (key === "d") {
        type = "down";
    } else if (key === "i") {
        type = "idle";
    } else if (key === "z") {
        type = "in"; // zoom in
    } else if (key === "o") {
        type = "out"; // zoom out
    } else if (key === "1") {
        type = "one";
    } else if (key === "3") {
        type = "three";
    } else if (key === "7") {
        type = "seven";
    } else if (key === "9") {
        type = "nine";
    } else if (key === "t") {
        /* FUNCTIONs */
        if (trainCounter == 0) {
            trainModel_idle();
            trainCounter++;
        } else if (trainCounter == 1) {
            trainModel_scroll();
            trainCounter++;
        } else if (trainCounter == 2) {
            trainModel_zoom();
            trainCounter++;
        } else if (trainCounter == 3) {
            trainModel_num();
            console.log("All models trained.");
            trainCounter++;
        }
    } else if (key === "s") {
        if (saveCounter == 0) {
            brain_idle.save();
            console.log('Idle model saved!');
            saveCounter++;
        } else if (saveCounter == 1) {
            brain_scroll.save();
            console.log('Scroll model saved!');
            saveCounter++;
        } else if (saveCounter == 2) {
            brain_zoom.save();
            console.log('Zoom model saved!');
            saveCounter++;
        } else if (saveCounter == 3) {
            brain_num.save();
            console.log('Num model saved!');
            console.log("All models saved.");
            saveCounter++;
        }
    }
    return false; // prevent any default behaviour
}

function get_delta(a) {
    // a is an array
    // Return the delta (absolute) of last two numbers
    let l = a.length;
    return abs(a[l - 1] - a[l - 2]);
}

function get_delta12(a) {
    // a is an array
    // Return the delta (absolute) of the last number and the number 12 index ahead
    let l = a.length;
    return abs(a[l - 1] - a[l - 13]);
}

function get_sd(a, len) {
    // Return the standard deviation of last ten numbers
    let arr = a.slice(-len);
    let average = arr.reduce((sum, x) => x + sum, 0) / arr.length;
    let sq_total = 0; // Total of sum of (each - average)**2
    for (let sqc = 0; sqc < len; sqc++) {
        sq_total += sq(arr[sqc] - average);
    }
    return sqrt(sq_total / len - 1);
}