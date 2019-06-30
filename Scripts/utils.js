const fs = require('fs');
const shell = require('shelljs');

require('colors');


/**
 * @function checkPython
 * @description Synchronously checks if the correct python version is available
 * on the host system.
 * @returns Boolean. If python is available returns true, if python is not available
 * returns false.
 */
function checkPython() {
    // Check if python is installed.
    if (shell.which("python")) {
        // If python is available check it's version.

        const version = shell.exec("python --version", { silent: true }).stdout.replace(/\r|\n/g, "");

        if (version.match(/^Python 3\.7\.\d$/g)) {
            // If the versions match, return true.
            return true;
        } else {
            // If they don't match, return false.
            return false;
        }
    } else {
        // If python is not available, return false.
        return false;
    }
}


/**
 * @function checkEnv
 * @description - Checks if the env directory exists.
 * @returns {Boolean} - returns true if the env does exist and false if it doesn't.
 */
function checkEnv() {
    if (fs.existsSync("./env")) {
        return true;
    } else {
        return false;
    }
}


module.exports = {
    checkPython,
    checkEnv
};
