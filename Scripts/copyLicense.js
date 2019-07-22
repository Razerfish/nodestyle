const fs = require('fs');

require('colors');


/**
 * @function main
 * @description Copies the license file from ./torchbrain/neural_style/LICENSE to ./app/bin/torchbrain/LICENSE.
 */
function main() {
    fs.copyFileSync('./torchbrain/neural_style/LICENSE', './app/bin/torchbrain/LICENSE');

    if (fs.existsSync('app/bin/torchbrain/LICENSE')) {
        console.log("License copied successfully.".blue);
    } else {
        throw new Error("Failed to copy license.");
    }
}


if (require.main === module) {
    main();
}


module.exports = {
    main: main
};
