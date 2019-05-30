const execFile = require('child_process').execFile;

const path = require('path');
const fs = require('fs');

const EventEmitter = require('events');

/**
 * @function createNeuralStyle
 * @param {Object} args Json object of arguments to pass to neural style.
 * @description Creates a child process with neural style running.
 * @returns {Object} Child process object.
 */
function createNeuralStyle(args) {
    // Find the path to the torchbrain binary.
    const torchPath = path.join(__dirname, "bin/torchbrain/torchbrain.exe");

    // Make sure that the torchbrain binary is present.
    fs.access(torchPath, fs.constants.F_OK, (err) => {
        if (err) {
            throw err;
        } else {
            return execFile(torchPath, [JSON.stringify(args)]);
        }
    });
}
