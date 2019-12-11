# handy

A new interface based on EMG and machine learning.

Here a demo based on Node.js shows how the data is collected and how people interact with it.

- server.js: Stream the data from OpenBCI Cyton board and boardcast to clients.
- Graph: Plot using data received.
- Collect: Collect data and train the model with ml5.NeuralNetwork.
- Predict: An interactive web page based on a real website (jpl.design). Model used will load from the ones trained in `collect`.
