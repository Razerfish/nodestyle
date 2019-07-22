const ora = require('ora');
const cp = require('child_process');


/**
 * @function main
 * @description Compiles torchbrain to a binary and logs output through spinners.
 * @returns A promise representing the completion of compilation.
 */
function main() {
    return new Promise((resolve, reject) => {
        const spinner = ora({ prefixText: "Compiling torchbrain", spinner: "line" }).start();


        const compile = cp.execFile("./env/Scripts/pyinstaller.exe", ['torchbrain.spec', '--onedir', '--noconfirm', '--workpath=build', '--distpath=app/bin']);

        compile.stdout.on('data', (data) => {
            spinner.text = data.toString().trim();
        });

        compile.stderr.on('data', (data) => {
            spinner.text = data.toString().trim();
        });

        compile.on('exit', (code) => {
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


if (require.main === module) {
    main().then(() => {
        process.exit(0);
    }).catch(() => {
        process.exit(1);
    });
}


module.exports = {
    main: main
};
