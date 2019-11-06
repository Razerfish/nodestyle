const fs = require('fs');
const ora = require('ora');
const venv = require('./venv');
const compile = require('./compile');
const rimraf = require('rimraf');
const model = require('./acquireModel');
const precompile = require('./precompile');
const copyLicense = require('./copyLicense');

require('colors');

async function main() {
    if (process.env.NODESTYLE_SKIP_PREPARE == "false") {
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
    } else {
        console.log("Skipping prepare script\n".yellow);
    }
}


main().catch((err) => {
    throw err;
});
