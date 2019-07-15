const fs = require('fs');
const os = require('os');
const path = require('path');
const python = require('./python');
const cp = require('child_process');
const model = require('./acquireModel');


require('colors');


function verifyEnv() {
    if (python.checkEnv()) {
        const precompile = cp.execFile("./env/Scripts/PYTHON.exe", ["Scripts/precompile.py"]);

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
        console.error("env is not present".red);
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

verifyEnv();
checkModel();
