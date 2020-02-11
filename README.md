# handy

Handy is a wearable interface interpreting tangible interaction to intangible experiences.

[Project blog](https://blog.jpl.design/posts/machine-learning-for-the-arts/handy/) | [Demo Video](https://vimeo.com/379383886)

Handy is based on ml5.js Neural Network developed by NYU ITP, and Cyton developed by OpenBCI. This repository stores source code for the data collection, training, and predicting processes of Handy. The demo displaying basic usages is based on Node.js with a hacked version of my own portfolio website.

## Stellar

- `server.js`: Stream the data from OpenBCI Cyton board and boardcast to clients.
- `graph` Folder: Plot using data received.
- `collect` Folder: Collect data and train the model with ml5.NeuralNetwork.
- `predict` Folder: An interactive web page based on a real website (jpl.design). Model used will load from the ones trained previously in `collect`.

### References

1. [Electromyography - Wikipedia](https://en.wikipedia.org/wiki/Electromyography)
2. [Muscles of the Upper Limb - Wikipedia](https://en.wikipedia.org/wiki/Category:Muscles_of_the_upper_limb)
3. [Arm - Wiki](https://en.wikipedia.org/wiki/Arm), [Upper Limb - Wiki](https://en.wikipedia.org/wiki/Upper_limb)
4. [AlterEgo - MIT Media Lab](https://www.media.mit.edu/projects/alterego/overview/), [Paper](https://dl.acm.org/citation.cfm?id=3172977)
5. [OpenBCI](https://openbci.com)
6. [Techniques of EMG signal analysis: detection, processing, classification and applications](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1455479/)
7. [EMG Signal Classification for Human Computer Interaction A Review](https://www.researchgate.net/publication/215677997_EMG_Signal_Classification_for_Human_Computer_Interaction_A_Review) (Table 1: Summary of major methods used for EMG classification in the field of HCI)
8. [A new means of HCI: EMG-MOUSE](https://ieeexplore.ieee.org/document/1398280)

### Technical References

1. [Setting up for EMG - OpenBCI Doc](https://docs.openbci.com/docs/01GettingStarted/02-Biosensing-Setups/EMGSetup)
2. [Python signal filter test by J77M](https://github.com/J77M/openbciGui_filter_test/blob/master/fft_data.ipynb)
3. [OpenBCI/OpenBCI_NodeJS_Cyton - GitHub](https://github.com/OpenBCI/OpenBCI_NodeJS_Cyton)
4. [OpenBCI/OpenBCI_NodeJS - GitHub](https://github.com/OpenBCI/OpenBCI_NodeJS)
