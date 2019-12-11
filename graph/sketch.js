let socket = io();
let serial;

let counter = 0;

let all_1 = [];
let all_2 = [];
let all_3 = [];
let all_4 = [];

// Listen for confirmation of connection
socket.on('connect', function () {
    console.log("Connected");
});

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();

    socket.on('channeldata', function (data) {

        counter++;
        // channel_data = [
        //     data.channel_1 * 100000,
        //     data.channel_2 * 100000
        // ];
        all_1.push(data.channel_1 * 300000);
        all_2.push(data.channel_2 * 300000);
        all_3.push(data.channel_3 * 300000);
        all_4.push(data.channel_4 * 300000);
        // if (counter % 30 == 0) {
            // console.log('Receiving... ', channel_data);
        // }
    });
}

function draw() {
    background(255);
    strokeWeight(0.2);
    for (let i = 0; i < all_1.length - 1; i += 1) {
        stroke(200, 0, 0);
        line(i * 1, all_1[i]/2, (i + 1) * 1, all_1[i + 1]/2);
    }
    for (let i = 0; i < all_2.length - 1; i += 1) {
        stroke(0, 200, 0);
        line(i * 1, all_2[i]/2 + height / 2, (i + 1) * 1, all_2[i + 1]/2 + height / 2);
    }
    for (let i = 0; i < all_3.length - 1; i += 1) {
        stroke(0, 0, 200);
        line(i * 1, all_3[i]/2 + height / 2, (i + 1) * 1, all_3[i + 1]/2 + height / 2);
    }
    for (let i = 0; i < all_4.length - 1; i += 1) {
        stroke(0);
        console.log(all_4[i]);
        line(i * 1, all_4[i]/2, (i + 1) * 1, all_4[i + 1]/2);
    }
}