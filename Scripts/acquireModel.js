const os = require('os');
const fs = require('fs');
const ora = require('ora');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

require('colors');



/**
 * @function downloadModel
 * @description Download the vgg16 model from pytorch.org to ./torchbrain/vgg16-397923af.pth
 * @return Promise representing the result of the attempt to download the model.
 */
function downloadModel() {
    return new Promise((resolve, reject) => {
        const spinner = ora({ prefixText: "Downloading model", spinner: "line" }).start();

        try {
            const modelFile = fs.createWriteStream("./torchbrain/vgg16-397923af.pth.tmp");
            https.get("https://download.pytorch.org/models/vgg16-397923af.pth", (res) => {
                // Pipe output to modelFile
                res.pipe(modelFile);

                // Track download progress
                let downloaded = 0;
                res.on('data', (chunk) => {
                    downloaded += chunk.length;
                    spinner.text = `${Math.floor((downloaded / res.headers['content-length']) * 100)}%`;
                });

                res.on('end', () => {
                    if (fs.existsSync("./torchbrain/vgg16-397923af.pth.tmp")) {
                        // Rename temp file
                        fs.renameSync("./torchbrain/vgg16-397923af.pth.tmp", "./torchbrain/vgg16-397923af.pth");

                        spinner.text = "";
                        spinner.succeed();

                        resolve(true);
                    } else {
                        spinner.fail();

                        resolve(false);
                    }
                });
            });
        } catch (err) {
            spinner.fail();

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
    const spinner = ora({ prefixText: "Copying model", spinner: "line" }).start();

    try {
        fs.copyFileSync(src, "./torchbrain/vgg16-397923af.pth");
    } catch (err) {
        spinner.fail(err);
        return;
    }

    spinner.succeed();
    return;
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
        const spinner = ora({ prefixText: "Verifying model", spinner: "line" }).start();

        setTimeout(() => {
            spinner.fail();

            reject(new Error(`Exceeded timeout of ${timeout} ms`));
        }, timeout);

        /*
        Attempt to get model hash from file name.
        The target models are named using this pattern: vgg16-{hex digits from the files hash}.pth
        */
        const srcHash = path.basename(modelPath).match(/(?<=vgg16-)([0-9a-f]*)(?=\.pth)/gi)[0];

        let hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        const srcFile = fs.createReadStream(modelPath);

        srcFile.on('end', () => {
            hash.end();
            hash = hash.read().substr(0, srcHash.length);
            if (hash == srcHash) {
                spinner.succeed();

                resolve(true);
            } else {
                spinner.fail();

                resolve(false);
            }
        });

        srcFile.pipe(hash);
    });
}



/**
 * @function main
 * @description Attempts to run either downloadModel or copyModel.
 * @returns A promise representing the completion of installing the model.
 */
function main() {
    return new Promise((resolve, reject) => {
        // Check if Vgg16 model already exists.
        if (fs.existsSync("./torchbrain/vgg16-397923af.pth")) {
            console.log("Model is already present");
            resolve();
        } else {
            // If it doesn't exist download/copy it.
            if (fs.existsSync(path.join(os.homedir(), ".torch/models/vgg16-397923af.pth"))) {
                copyModel();
                // Check that the new model is intact.
                verifyModel("./torchbrain/vgg16-397923af.pth").then((res) => {
                    if (res) {
                        resolve();
                    } else {
                        reject();
                    }
                }).catch((err) => {
                    throw err;
                });
            } else {
                downloadModel().then((res) => {
                    if (res) {
                        // Check that the new model is intact.
                        verifyModel("./torchbrain/vgg16-397923af.pth").then((res) => {
                            if (res) {
                                resolve();
                            } else {
                                reject();
                            }
                        }).catch((err) => {
                            throw err;
                        });
                    } else {
                        console.error("Failed to download model".red);
                        reject();
                    }
                }).catch((err) => {
                    throw err;
                });
            }
        }
    });
}


if (require.main === module) {
    main().then(() => {
        process.exit(0);
    }).catch(() => {
        process.exit(1);
    });
}


module.exports = {
    downloadModel: downloadModel,
    copyModel: copyModel,
    verifyModel: verifyModel,
    main: main
};
