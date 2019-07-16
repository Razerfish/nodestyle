const ora = require('ora');
const python = require('./python');
const cp = require('child_process');
const execFile = require('child_process').execFile;

require('colors');


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

        const spinner = ora({ prefixText: "Creating virtual environment", spinner: "line" });
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
            if (code === 0) {
                spinner.succeed();

                resolve();
            } else {
                spinner.succeed();

                reject();
            }
        });
    });
}
/* eslint-enable no-shadow */


/**
 * @function prepareEnv
 * @description Upgrades pip and setuptools to their latest versions.
 * @returns A promise representing the completion of the described task.
 */
function prepareEnv() {
    return new Promise((resolve, reject) => {
        const spinner = ora({ prefixText: "Upgrading components", spinner: "line" }).start();

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

                resolve();
            } else {
                spinner.text = "";
                spinner.fail();

                reject();
            }
        });    
    });
}


/**
 * @function installEnv
 * @description Installs dependencies as defined in requirements.txt.
 * @returns A promise representing the completion of the described task.
 */
function installEnv() {
    return new Promise((resolve, reject) => {
        const spinner = ora({ prefixText: "Installing dependencies", spinner: "line" }).start();

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
    });
}


/**
 * @function verifyEnv
 * @description Check if all required packages are installed to the virtual environment.
 * @return {Array} [satisfies, missing, conflicting]
 */
function verifyEnv() {
    const verify = JSON.parse(cp.execFileSync("./env/Scripts/PYTHON.exe", ["./Scripts/precompile.py"]).toString());

    return [verify.satisfies, verify.missing, verify.conflicting];
}


/**
 * @function main
 * @description Creates, prepares and installs required packages to a new virtual environment.
 */
async function main() {
    // Check if python is available.
    const pythonPath = python.findPython({ silent: true });

    if (pythonPath) {
        // Check if env exists.
        const env = python.checkEnv();

        if (env) {
            if (!verifyEnv()[0]) {
                await prepareEnv();
                await installEnv();
            }

        } else {
            await createEnv();
            await prepareEnv();
            await installEnv();
        }
    } else {
        console.error("Python is not available\n".red);
        throw new Error("Python is not available");
    }
}


if (require.main === module) {
    main().catch((err) => {
        console.error(err.toString().red);
        process.exit(1);
    });
}


module.exports = {
    main: main,
    createEnv: createEnv,
    prepareEnv: prepareEnv,
    installEnv: installEnv,
    verifyEnv: verifyEnv
};
