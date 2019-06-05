const path = require('path');
const fs = require('fs');

/**
 * @function getTorchPath
 * @description Find the path to the torchbrain binary, check that the file exists and return the path.
 * @returns {string} Path to torchbrain binary.
 */
function getTorchPath() {
    // Get path to torchbrain binary.
    const torchPath = path.join(__dirname, "bin/torchbrain/torchbrain.exe");

    // Verify that torchbrain binary exists.
    fs.accessSync(torchPath, fs.constants.F_OK);

    // Return the path.
    return torchPath
}

module.exports = {
    getTorchPath
}
