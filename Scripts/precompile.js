const fs = require('fs');
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
    const model = fs.existsSync("./torchbrain/vgg16-397923af.pth");

    if (!model) {
        console.error("Vgg16 model is missing from torchbrain, download it by running: npm run model".red);
        process.exit(2);
    } else {
        console.log("Vgg16 model is present\n".blue);
        process.exit(0);
    }
}

checkEnv();
