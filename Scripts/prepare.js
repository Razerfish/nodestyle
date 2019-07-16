const fs = require('fs');
const ora = require('ora');
const venv = require('./venv');
const compile = require('./compile');
const rimraf = require('rimraf');
const model = require('./acquireModel');
const precompile = require('./precompile');
const copyLicense = require('./copyLicense');


async function main() {
    await venv.main();
    await model.main();
    precompile.main();
    await compile.main();
    copyLicense.main();


    const spinner = ora({ prefixText: "Cleaning up", spinner: "line" }).start();

    spinner.text = "env";
    rimraf("./env", (err) => {
        if (err) {
            spinner.fail();

            throw err;
        }

        spinner.text = "build";
        rimraf("./build", (err) => {
            if (err) {
                spinner.fail();

                throw err;
            }

            spinner.text = "vgg16-397923af.pth";
            fs.unlink("./torchbrain/vgg16-397923af.pth", (err) => {
                if (err) {
                    spinner.fail();

                    throw err;
                }

                spinner.text = "";
                spinner.succeed();

                process.exit(0);
            });
        });
    });
}


main().catch((err) => {
    throw err;
});
