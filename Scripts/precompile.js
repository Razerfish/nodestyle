const fs = require('fs');
const os = require('os');
const ora = require('ora');
const path = require('path');
const venv = require('./venv');
const model = require('./acquireModel');

require('colors');


/**
 * @function checkModel
 * @description Checks if the vgg16 model is present at ./torchbrain/vgg16-397923af.pth. If the model is not present it either downloads or copies it.
 */
function checkModel() {
    const spinner = ora({ prefixText: "Verifing model", spinner: "line" }).start();

    if (!fs.existsSync("./torchbrain/vgg16-397923af.pth")) {
        spinner.fail("Model file is missing\n");
        console.log("Attempting to create model file...\n");

        if (fs.existsSync(path.join(os.homedir(), ".torch/models/vgg16-397923af.pth"))) {
            model.copyModel();
        } else {
            model.downloadModel();
        }
    } else {
        spinner.succeed();
    }
}


/**
 * @function main
 * @description Verifies the env contents and checks if the model is present. If either of these fails an error is thrown.
 */
function main() {
    const envStatus = venv.verifyEnv();

    if (!envStatus.satisfies) {
        if (envStatus.missing.length > 0) {
            let missing = "";
            for (let i = 0; i < envStatus.missing.length; i++) {
                let item = envStatus.missing[i];

                if (i < envStatus.missing.length - 1) {
                    item = `${item}, `;
                }

                missing = missing + item;
            }

            console.error(`The following package(s) are missing: ${missing}`.red);
        }

        if (envStatus.conflicting.length > 0) {
            let conflicting = "";
            for (let i = 0; i < envStatus.conflicting.length; i++) {
                let item = envStatus.conflicting[i];

                if (i < envStatus.conflicting.length - 1) {
                    item = `${item}, `;
                }

                conflicting = conflicting + item;
            }

            console.error(`The following package(s) have version conflicts: ${conflicting}`.red);
        }

        throw new Error("Virtual environment does not satisfy requirements");
    } else {
        console.log("All packages are installed and there are no version conflicts\n".blue);
    }


    checkModel();
}


if (require.main === module) {
    main();
}


module.exports = {
    main: main
};
