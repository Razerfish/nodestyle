const execFile = require('child_process').execFile;
const execFileSync = require('child_process').execFileSync;

const fs = require('fs');
const path = require('path');

// Check CUDA has an average runtime of 520.255 ms

/**
 * @function checkCuda
 * @description Check if CUDA is available on the target system.
 * @returns {Promise} Promise object representing if CUDA is available or not.
 */
function checkCuda() {
    return new Promise((resolve, reject) => {
        // Find the path to the torchbrain binary.
        const torchPath = path.join(__dirname, "bin/torchbrain/torchbrain.exe");

        // Make sure that the torchbrain binary exists.
        fs.access(torchPath, fs.constants.F_OK, (err) => {
            if (err) {
                reject(err);
            } else {
                // Create the process to check if CUDA is available.
                const cudaProcess = execFile(path.join(__dirname, "bin/torchbrain/torchbrain.exe"), ["check_cuda"]);

                // Once we get the result from the cudaProcess store it in cudaAvailable.
                let cudaAvailable;
                cudaProcess.stdout.on('data', (data) => {
                    cudaAvailable = JSON.parse(data.toString()).data;
                });

                // Whenever we get an error, check if it can be parsed as JSON and store it in errors.
                let errors = [];
                cudaProcess.stderr.on('data', (error) => {
                    error.toString().split("\n").forEach((chunk) => {
                        if (chunk.length > 0) {
                            try {
                                errors.push(JSON.parse(chunk).data);
                            } catch (err) {
                                errors.push(chunk);
                            }
                        }
                    });
                });

                cudaProcess.on('exit', (code) => {
                    // If the exit code is not 0, reject with the errors, otherwise resolve with cudaAvailable.
                    if (code !== 0) {
                        reject(errors);
                    } else {
                        resolve(cudaAvailable);
                    }
                });
            }
        });
    });
}


/**
 * @function checkCudaSync
 * @param {number} timeout Timeout for the check CUDA process in milliseconds, default is 10000.
 * @description Same as checkCuda but synchronous.
 * @returns true or false
 */
function checkCudaSync(timeout = 10000) {
    // Get output from the check CUDA process.
    let cuda = execFileSync(path.join(__dirname, "bin/torchbrain/torchbrain.exe"), ["check_cuda"], {
        timeout: timeout
    });

    // Parse and return the output.
    return JSON.parse(cuda).data;
}

module.exports = {
    checkCuda,
    checkCudaSync
}
