const ora = require('ora');
const rimraf = require('rimraf');
const python = require('./python');
const cp = require('child_process');
const execFile = require('child_process').execFile;

require('colors');


/**
 * @function removeEnv
 * @returns Promise object that resolves once the ./env folder has been deleted or can 
 * reject with an error.
 * @description Deletes an existing python virtual environment found in env.
 */
function removeEnv() {
    return new Promise((resolve, reject) => {
        rimraf("env", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * @function createEnv
 * @returns Promise object that resolves once a new python virtual environment with all packages is
 * installed successfully.
 * created at ./env, or rejects if it fails.
 * @description Creates a new python virtual environment at ./env and installs packages from
 * ./requirements.txt.
 */
function createEnv() {
    /* eslint-disable no-shadow */
    return new Promise((resolve, reject) => {
        const pythonPath = python.findPython();

        let spinner = ora({ prefixText: "Creating virtual environment", spinner: "line" });
        spinner.start();

        // Create virtual environment.
        const create = cp.execFile(pythonPath, ['-m', 'venv', 'env']);

        create.stdout.on('data', (data) => {
            spinner.text = data.toString().trim();
        });

        create.stderr.on('data', (data) => {
            spinner.warn(data.toString().trim()).start();
        });

        create.on('exit', (code) => {
            if (code !== 0) {
                spinner.fail();

                reject();
            } else {
                spinner.succeed();

                spinner = ora({ prefixText: "Upgrading components", spinner: "line" }).start();


                // Upgrade pip and setuptools
                const upgrade = execFile("./env/Scripts/python.exe", [
                    '-m',
                    'pip',
                    'install',
                    '-U',
                    'pip',
                    'setuptools'
                ]);

                upgrade.stdout.on('data', (data) => {
                    spinner.text = data.toString().trim();
                });

                upgrade.stderr.on('data', (data) => {
                    spinner.warn(data.toString().trim()).start();
                });

                upgrade.on('exit', (code) => {
                    if (code === 0) {
                        spinner.text = "";
                        spinner.succeed();

                        spinner = ora({ prefixText: "Installing dependencies", spinner: "line" }).start();

                        // Install packages from requirements.txt
                        const install = execFile("./env/Scripts/pip.exe", [
                            'install',
                            '-r',
                            'requirements.txt'
                        ]);

                        install.stdout.on('data', (data) => {
                            spinner.text = data.toString().trim();
                        });

                        install.stderr.on('data', (data) => {
                            spinner.warn(data.toString().trim());
                        });

                        install.on('exit', (code) => {
                            if (code === 0) {
                                spinner.text = "";
                                spinner.succeed();

                                resolve();
                            } else {
                                spinner.fail();

                                reject();
                            }
                        });
                    } else {
                        spinner.fail();

                        reject();
                    }
                });
            }
        });
    });
}
/* eslint-enable no-shadow */

(async () => {
    // Check if python is available.
    const pythonPath = python.findPython({ silent: true });

    if (pythonPath) {
        // Check if env exists.
        const env = python.checkEnv();

        if (env) {
            await removeEnv();
            await createEnv();
        } else {
            await createEnv();
        }
    } else {
        console.error("Python is not available\n".red);
        process.exit(1);
    }
})().catch((err) => {
    console.error(err.toString().red);
    process.exit(1);
});
