const fs = require('fs');
const os = require('os')
const path = require('path');
const model = require('./acquireModel');
const utils = require('./utils');
const exec = require('child_process').exec;

require('colors');

function checkEnv() {
    if (utils.checkPython()) {
        const precompile = exec("py Scripts/precompile.py");

        precompile.stderr.on('data', (data) => {
            console.error(`${data.toString()}\n`.red);
        });

        precompile.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        precompile.on('exit', (code) => {
            if (code === 0) {
                checkModel();
            } else {
                process.exit(1);
            }
        });
    } else {
        console.error("Python is not available\n".red);
        process.exit(1);
    }
}

function checkModel() {
    if (!fs.existsSync("./torchbrain/vgg16-397923af.pth")) {
        if (fs.existsSync(path.join(os.homedir(), ".torch/models/vgg16-397923af.pth"))) {
            model.copyModel();
        } else {
            model.downloadModel();
        }
    } else {
        console.log("Model is present\n".blue);
    }
}

checkEnv();
