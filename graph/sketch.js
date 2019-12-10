let socket = io();

let counter = 0;

let all_1 = [];

// Listen for confirmation of connection
socket.on('connect', function () {
    console.log("Connected");
});

function setup() {
    createCanvas(windowWidth, windowHeight);

    socket.on('channeldata', function (data) {

        counter++;
        // channel_data = [
        //     data.channel_1 * 100000,
        //     data.channel_2 * 100000
        // ];
        all_1.push(data.channel_1 * 300000);
        // if (counter % 30 == 0) {
            // console.log('Receiving... ', channel_data);
        // }
    });
}

function draw() {
    for (let i = 0; i < all_1.length - 1; i += 1) {
        strokeWeight(0.1);
        console.log(all_1[i]);
        line(i * 1, all_1[i]/2 + height / 2, (i + 1) * 1, all_1[i + 1]/2 + height / 2);
        if (i == width) {
            saveCanvas();
        }
    }
}