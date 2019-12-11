// Create server
let httpPort = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(httpPort, function () {
  console.log('Server listening at port: ', httpPort);
});


/*-------------------------------------------------------------------------*/

// Tell server where to look for files
// app.use(express.static('graph'));
// app.use(express.static('collect'));
app.use(express.static('predict'));

/*-------------------------------------------------------------------------*/


// Create socket connection
let io = require('socket.io').listen(server);

// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {

    console.log("Client has connected " + socket.id);

    // // Listen for data from this client
    // socket.on('data', function(data) {
    //   // Data can be numbers, strings, objects
    // 	console.log("Received: 'data' " + data);

    // 	// Send it to all clients, including this one
    // 	io.sockets.emit('data', data);
    // });

    // Listen for this client to disconnect
    socket.on('disconnect', function () {
      console.log("Client has disconnected " + socket.id);
    });
  }
);

// Connect to Cyton and emit data to clients
const Cyton = require("@openbci/cyton");

const debug = false;
const verbose = true;

const ourBoard = new Cyton(
  {
    debug: debug,
    verbose: verbose
  }
);

// ON
ourBoard.channelSet(1, false, 24, "normal", true, false, false);
ourBoard.channelSet(2, false, 24, "normal", true, false, false);
ourBoard.channelSet(3, false, 24, "normal", true, false, false);
ourBoard.channelSet(4, false, 24, "normal", true, false, false);
// OFF
ourBoard.channelSet(5, true, 24, "normal", true, false, false);
ourBoard.channelSet(6, true, 24, "normal", true, false, false);
ourBoard.channelSet(7, true, 24, "normal", true, false, false);
ourBoard.channelSet(8, true, 24, "normal", true, false, false);

var port = "COM3"

ourBoard
  .connect(port)
  .then(function () {
    ourBoard.streamStart();
    ourBoard.on("sample", function (sample) {
      console.log('Sampling');
      // console.log('C1 ', sample.channelData[0]);
      io.sockets.emit('channeldata', {
        channel_1: sample.channelData[0],
        channel_2: sample.channelData[1],
        channel_3: sample.channelData[2],
        channel_4: sample.channelData[3]
      });
      // console.log(channel_data);
    });
  })
  .catch(function (err) {
    console.log('Rejected');
  });

// do something when app is closing
process.on('exit', exitHandler.bind(null, {
  cleanup: true
}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
  exit: true
}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
  exit: true
}));

function exitHandler(options, err) {
  if (options.cleanup) {
    if (verbose) console.log('clean');
    ourBoard.removeAllListeners();
    /** Do additional clean up here */
  }
  if (err) console.log(err.stack);
  if (options.exit) {
    if (verbose) console.log('exit');
    ourBoard.disconnect()
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        console.log(err);
        process.exit(0);
      });
  }
}
