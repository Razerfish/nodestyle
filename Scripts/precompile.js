const fs = require('fs');
const os = require('os');
const path = require('path');
const venv = require('./venv');
const model = require('./acquireModel');

require('colors');


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

const envStatus = venv.verifyEnv();

if (!envStatus[0]) {
    if (envStatus[1].length > 0) {
        let missing = "";
        for (let i = 0; i < envStatus[1].length; i++) {
            let item = envStatus[1][i];

            if (i < envStatus[1].length - 1) {
                item = `${item}, `;
            }

            missing = missing + item;
        }

        console.error(`The following package(s) are missing: ${missing}`.red);
    }

    if (envStatus[2].length > 0) {
        let conflicting = "";
        for (let i = 0; i < envStatus[2].length; i++) {
            let item = envStatus[2][i];

            if (i < envStatus[2].length - 1) {
                item = `${item}, `;
            }

            conflicting = conflicting + item;
        }

        console.error(`The following package(s) have version conflicts: ${conflicting}`.red);
    }

    process.exit(1);
} else {
    console.log("All packages are installed and there are no version conflicts\n".blue);
}


checkModel();
