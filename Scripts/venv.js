const ora = require('ora');
const python = require('./python');
const cp = require('child_process');
const execFile = require('child_process').execFile;

require('colors');


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


function prepareEnv() {
    return new Promise((resolve, reject) => {
        const spinner = ora({ prefixText: "Upgrading components", spinner: "line" }).start();

        // Upgrade pip and setuptools
        const upgrade = execFile(`${python.binPath}python${python.binExt}`, [
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


function installEnv() {
    return new Promise((resolve, reject) => {
        const spinner = ora({ prefixText: "Installing dependencies", spinner: "line" }).start();

        // Install packages from requirements.txt
        const install = execFile(`${python.binPath}pip${python.binExt}`, [
            'install',
            '-r',
            `requirements-${process.platform}.txt`
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


function verifyEnv() {
    const verify = JSON.parse(cp.execFileSync(`${python.binPath}python${python.binExt}`, ["./Scripts/precompile.py"]).toString());

    return verify;
}


async function main() {
    // Check if python is available.
    const pythonPath = python.findPython({ silent: true });

    if (pythonPath) {
        // Check if env exists.
        const env = python.checkEnv();

        if (env) {
            if (!verifyEnv().satisfies) {
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
