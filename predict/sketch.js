const debug = true;

// NOW 4-4-3
// (idle 4, scroll 4, zoom 3)

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

/*-------------------------------------------------------------*/

let ifIdle = 'idle'; // not
let ifScroll = 'up'; // down
let ifZoom = 'in'; // out
let theNum = null; // 1/3/7/9

/*-------------------------------------------------------------*/

let amplifier = 500000;

const options_idle = {
    inputs: 12 /* 3 for each, 4 channels*/,
    outputs: 2 /* idle / not */,
    task: "classification",
    debug: true
};

const options_scroll = {
    inputs: 12 /* 3 for each, 2 channels, 1-2 */,
    outputs: 3 /* up down */,
    task: "classification",
    debug: true
};

const options_zoom = {
    inputs: 9 /* 3 for each, 2 channels, 3-4*/,
    outputs: 3 /* in / out */,
    task: "classification",
    debug: true
};

const options_num = {
    inputs: 6 /* 3 for each, 2 channels, 3-4*/,
    outputs: 4 /* 1/3/7/9 */, // TODO: more numbers
    task: "classification",
    debug: true
};

// ------ SETUP ------

function preload() {
    trump_photo = loadImage('hack_assets/trump.jpg');
}

function setup() {
    socket.on('channeldata', function (data) {
        // Up to 4 channels
        channel_1_all.push(data.channel_1 * amplifier);
        channel_2_all.push(data.channel_2 * amplifier);
        channel_3_all.push(data.channel_3 * amplifier);
        channel_4_all.push(data.channel_4 * amplifier);
    });

    cnv = createCanvas(windowWidth, windowHeight);
    page_stage = 'home';

    brain_idle = ml5.neuralNetwork(options_idle);
    brain_scroll = ml5.neuralNetwork(options_scroll);
    brain_zoom = ml5.neuralNetwork(options_zoom);
    // brain_num = ml5.neuralNetwork(options_num);

    let loadOption_idle = {
        model: 'models/443-5/idle/model.json',
        metadata: 'models/443-5/idle/model_meta.json',
        weights: 'models/443-5/idle/model.weights.bin',
    };
    let loadOption_scroll = {
        model: 'models/443-5/scroll/model.json',
        metadata: 'models/443-5/scroll/model_meta.json',
        weights: 'models/443-5/scroll/model.weights.bin',
    };
    let loadOption_zoom = {
        model: 'models/443-5/zoom/model.json',
        metadata: 'models/443-5/zoom/model_meta.json',
        weights: 'models/443-5/zoom/model.weights.bin',
    };
    // let loadOption_num = {
    //     model: 'models/4-2-2/num/model.json',
    //     metadata: 'models/4-2-2/num/model_meta.json',
    //     weights: 'models/4-2-2/num/model.weights.bin',
    // };

    brain_idle.load(loadOption_idle, predict_idle);
    brain_scroll.load(loadOption_scroll, predict_scroll);
    brain_zoom.load(loadOption_zoom, predict_zoom);
}

/*--------------------------- IDLE ---------------------------*/

function predict_idle() {
    brain_idle.predict([
        get_delta(channel_1_all), get_delta12(channel_1_all), get_sd(channel_1_all, 12),
        get_delta(channel_2_all), get_delta12(channel_2_all), get_sd(channel_2_all, 12),
        get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
        get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12)
    ], gotResult_idle);
}

function gotResult_idle(error, outputs) {
    if (error) {
        console.log('IDLE PREDICT ERROR');
        console.error(error);
        return;
    }
    // console.log(outputs[0].label);
    ifIdle = outputs[0].label;
    predict_idle();
}

/*--------------------------- SCROLL ---------------------------*/

function predict_scroll() {
    // console.log("Predicting...");
    brain_scroll.predict([
        get_delta(channel_1_all), get_delta12(channel_1_all), get_sd(channel_1_all, 12),
        get_delta(channel_2_all), get_delta12(channel_2_all), get_sd(channel_2_all, 12),
        get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
        get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12)
    ], gotResult_scroll);
}

function gotResult_scroll(error, outputs) {
    if (error) {
        console.log('SCROLL PREDICT ERROR');
        console.error(error);
        return;
    }
    console.log(outputs[0].label);
    ifScroll = outputs[0].label;
    // if (outputs[0].label == "down") {
    //     window.scrollBy(0, 7);
    // }
    predict_scroll();
}

/*--------------------------- ZOOM ---------------------------*/

function predict_zoom() {
    // console.log("Predicting...");
    brain_zoom.predict([
        get_delta(channel_2_all), get_delta12(channel_2_all), get_sd(channel_2_all, 12),
        get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
        get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12)
    ], gotResult_zoom);
}

function gotResult_zoom(error, outputs) {
    if (error) {
        console.log('ZOOM PREDICT ERROR');
        console.error(error);
        return;
    }
    // console.log(outputs[0].label);
    ifZoom = outputs[0].label;
    predict_zoom();
}

/*--------------------------- NUM ---------------------------*/

function predict_num() {
    // console.log("Predicting...");
    brain_num.predict([
        get_delta(channel_3_all), get_delta12(channel_3_all), get_sd(channel_3_all, 12),
        get_delta(channel_4_all), get_delta12(channel_4_all), get_sd(channel_4_all, 12)
    ], gotResult_num);
}

function gotResult_num(error, outputs) {
    if (error) {
        console.log('NUM PREDICT ERROR');
        console.error(error);
        return;
    }
    // console.log(outputs[0].label);
    theNum = outputs[0].label;
    predict_num();
}




// ----------------------------------- DRAW -----------------------------------

let p1_photo_w = 10; // Width of trump's photo on page1

function draw() {
    if (page_stage == "home") {
        cnv.hide();

        if (ifIdle) {
            if (ifScroll == 'up') {
                window.scrollBy(0, -6);
            } else if (ifScroll == 'down') {
                window.scrollBy(0, 6);
            }
        }
    } else if (page_stage == 'page1') {
        if (!switchedHomeTo1) {
            switchTo1();
            switchedHomeTo1 = true;
            cnv.show();
        }
        background(255);
        if (ifIdle == 'not') {
            if (ifZoom == 'in') {
                p1_photo_w += 6;
            } else if (ifZoom == 'out') {
                p1_photo_w -= 6;
            }
            p1_photo_w = constrain(p1_photo_w, 5, 500);
            push();
            imageMode(CENTER);
            image(trump_photo, windowWidth/2, windowHeight/2, p1_photo_w, p1_photo_w*3/2);
            pop();
        }
    }
}

function keyPressed() {
    if (key === 'n') {
        if (page_stage == 'home') {
            page_stage = 'page1';
        } else if (page_stage == 'page1') {
            page_stage = 'page2'
        }
    }

    return false; // prevent any default behaviour
}

// HELPERS

function switchTo1() {
    var header = document.getElementById('header');
    header.parentNode.removeChild(document.getElementById('projects'));
    header.parentNode.removeChild(document.getElementById('statement'));
    header.parentNode.removeChild(document.getElementById('detailBox'));
    header.parentNode.removeChild(header);
}