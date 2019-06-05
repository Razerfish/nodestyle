const crypto = require('crypto');
const https = require('https');
const path = require('path');
const os = require('os');
const fs = require('fs');

require('colors');

/**
 * @function downloadModel
 * @description Download the vgg16 model from pytorch.org to ./torchbrain/vgg16-397923af.pth
 * @return Promise representing the result of the attempt to download the model.
 */
function downloadModel() {
    return new Promise((resolve, reject) => {
        try {
            const modelFile = fs.createWriteStream("./torchbrain/vgg16-397923af.pth.tmp");
            https.get("https://download.pytorch.org/models/vgg16-397923af.pth", (res) => {
                // Pipe output to modelFile
                res.pipe(modelFile);

                // Track download progress
                let downloaded = 0;
                let max = 0;
                let progress;
                let message;
                res.on('data', (chunk) => {
                    downloaded += chunk.length;
                    progress = Math.floor((downloaded / res.headers['content-length']) * 100);
                    message = `Download progress: ${progress}%`;
                    if (message.length > max) {
                        max = message.length;
                    } else {
                        for (var i = 0; i < max - message.length; i++) {
                            message += " ";
                        }
                    }
                    process.stdout.write(`${message}\r`);
                });

                res.on('end', () => {
                    if (fs.existsSync("./torchbrain/vgg16-397923af.pth.tmp")) {
                        // Rename temp file
                        fs.renameSync("./torchbrain/vgg16-397923af.pth.tmp", "./torchbrain/vgg16-397923af.pth");
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * @function copyModel
 * @param {string} src Path to copy model from, defaults to ~/.torch/models/vgg16-397923af.pth
 * @description Copy model from src to ./torchbrain/vgg16-397923af.pth
 */
function copyModel(src=path.join(os.homedir(), ".torch/models/vgg16-397923af.pth")) {
    console.log("Copying model...");
    fs.copyFileSync(src, "./torchbrain/vgg16-397923af.pth");
    console.log("Done!".green);
}

/**
 * @function verifyModel
 * @param {string} modelPath Path to model file to verify.
 * @param {Number} timeout Timeout in milliseconds. Default is 7500.
 * @description Verify a Vgg16 model with a sha256 hash in it's name.
 * @returns A promise representing a Boolean.
 */
function verifyModel(modelPath, timeout=7500) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Timeout of ${timeout}ms expired`));
        }, timeout);

        /*
        Attempt to get model hash from file name.
        The target models are named using this pattern: vgg16-{hex digits from the files hash}.pth
        */
        let srcHash = path.basename(modelPath).match(/(?<=vgg16-)([0-9a-f]*)(?=\.pth)/gi)[0];

        let hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        let srcFile = fs.createReadStream(modelPath);

        srcFile.on('end', () => {
            hash.end();
            hash = hash.read().substr(0, srcHash.length);
            if (hash == srcHash) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        srcFile.pipe(hash);
    });
}

function main() {
    // Check if Vgg16 model already exists.
    if (fs.existsSync("./torchbrain/vgg16-397923af.pth")) {
        console.log("Model is already present");
        process.exit(0);
    } else {
        // If it doesn't exist download/copy it.
        if (fs.existsSync(path.join(os.homedir(), ".torch/models/vgg16-397923af.pth"))) {
            copyModel();
            // Check that the new model is intact.
            console.log("Verifying model...");
            verifyModel("./torchbrain/vgg16-397923af.pth").then((res) => {
                if (res) {
                    console.log("Model verified!".green);
                    process.exit(0);
                } else {
                    console.error("Failed to verify model".red);
                    process.exit(1);
                }
            }).catch((err) => {
                throw err;
            });
        } else {
            downloadModel().then((res) => {
                if (res) {
                    console.log("Done!".green);
                    // Check that the new model is intact.
                    console.log("Verifying model...");
                    verifyModel("./torchbrain/vgg16-397923af.pth").then((res) => {
                        if (res) {
                            console.log("Model verified!".green);
                            process.exit(0);
                        } else {
                            console.error("Failed to verify model".red);
                            process.exit(1);
                        }
                    }).catch((err) => {
                        throw err;
                    });
                } else {
                    console.error("Failed to download model".red);
                    process.exit(1);
                }
            }).catch((err) => {
                throw err;
            });
        }
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    downloadModel,
    copyModel,
    verifyModel,
    main
}
