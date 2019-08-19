const fs = require('fs');
const ora = require('ora');
const path = require('path');
const shell = require('shelljs');
const semver = require('semver');
const cp = require('child_process');

//Make sure that the LOCALAPPDATA environment variable is a string.
if (process.env.LOCALAPPDATA == undefined) {
    process.env.LOCALAPPDATA = "";
}

/**
 * @function findPython
 * @param {Object} options 
 * @param {boolean} options.silent Run in silent mode.Object
 * @param {boolean} options.ignoreEnv Ignore the PYTHON environment variable when searching.
 * @description Searches for a usable python installation from a set of predetermined locations and the PYTHON environment variable.
 * @returns {string | boolean} If a usable python installation is found a path to it is returned, otherwise false is returned.
 */
function findPython(options) {
    // Input and type checking.

    if (typeof options !== 'object' && options !== undefined) {
        throw new TypeError(`The options parameter must be an object or undefined, got type of ${typeof options}`);
    } else if (options === undefined) {
        options = { silent: false, ignoreEnv: false };
    }

    if (options.silent === undefined) {
        options.silent = false;
    }

    if (typeof options.silent !== 'boolean') {
        throw new TypeError(`The options.silent parameter must be a boolean, got type of ${typeof options.silent}`);
    }

    if (options.ignoreEnv === undefined) {
        options.ignoreEnv = false;
    }

    if (typeof options.ignoreEnv !== 'boolean') {
        throw new TypeError(`The parameter options.ignoreEnv must be a boolean, got type of ${typeof options.silent}`);
    }


    // Define the acceptable python version range.
    const pythonVersionRange = "~3.7.0";


    /*
    Create parameters for searching.
    Currently there are only parameters for win32 systems, I hope to add support for MacOS and Linux systems in the future, but I should probably
    make sure that it actually works at all on Windows first.
    */
    const candidates = {
        win32: {
            entries: [
                "python",
                "python3",
                "python3-64",
                "python37",
                "python37-64"
            ],

            paths: [
                path.join(process.env.LOCALAPPDATA, "Programs/Python/Python37/Python.exe"),
                path.join(process.env.LOCALAPPDATA, "Programs/Python/Python37-64/Python.exe"),
                "C:/Python37/Python.exe"
            ]
        },

        linux: {
            entries: [
                "python",
                "python3",
                "python37",
                "python3.7"
            ],

            paths: [
                "/usr/bin/python",
                "/usr/bin/python3",
                "/usr/bin/python3.7"
            ]
        }
    };



    // Create spinner if not running in silent mode.
    const spinner = ora({ prefixText: "Locating Python", spinner: "line" });
    if (!options.silent) {
        spinner.start();
    }



    /*
    Start searching for a usable python installation using the available candidates in the following order:

    1. If ignoreEnv isn't enabled, attempt to search for python using the PYTHON environment variable.
    2. Search system PATH entries as defined in candidates.{platform}.entries.
    3. Search using direct file paths as defined in candidates.{platform}.paths.

    If no usable python installation is found from all of those options return false.
    */


    // If ignoreEnv is not enabled, attempt to search using the PYTHON environment variable.
    if (!options.ignoreEnv) {
        // Only search using the PYTHON environment variable if it is actually defined.
        if (process.env.PYTHON) {
            // Convert the PYTHON environment variable to an absolute path.
            process.env.PYTHON = path.resolve(process.env.PYTHON);


            // Ensure that the PYTHON environment variable points to a file that exists.
            if (fs.existsSync(process.env.PYTHON)) {
                // Check the file to make sure that it fulfills all needed parameters.
                
                const candidateData = JSON.parse(cp.execFileSync(process.env.PYTHON, ['-B', '-c', 'from __future__ import print_function; import json, sys; print(json.dumps({"x64": sys.maxsize > 2 ** 32, ' +
                '"version": str(sys.version_info[0]) + "." + str(sys.version_info[1]) + "." + str(sys.version_info[2])}))']).toString());

                if (candidateData.x64 === true) {
                    if (semver.satisfies(candidateData.version, pythonVersionRange)) {

                        if (!options.silent) {
                            spinner.succeed();
                        }

                        return process.env.PYTHON;
                    }
                }
            }
        }
    }



    // Search through system PATH for usable python installation.
    for (let i = 0; i < candidates[process.platform].entries.length; i++) {
        // Check if a given item is available on the system PATH.
        const pythonPath = shell.which(candidates[process.platform].entries[i]);
        
        // Check if the candidate python installation meets requirements.
        if (pythonPath) {
            const candidateData = JSON.parse(cp.execFileSync(pythonPath.toString(), ['-B', '-c', 'from __future__ import print_function; import json, sys; print(json.dumps({"x64": sys.maxsize > 2 ** 32, ' +
            '"version": str(sys.version_info[0]) + "." + str(sys.version_info[1]) + "." + str(sys.version_info[2]), "executable": sys.executable}))']).toString());

            if (candidateData.x64 === true) {
                if (semver.satisfies(candidateData.version, pythonVersionRange)) {

                    if (!options.silent) {
                        spinner.succeed();
                    }

                    return pythonPath.toString();
                }
            }
        }
    }



    // Check using direct file paths.
    for (let i = 0; i < candidates[process.platform].paths.length; i++) {
        // Check if given file exists.
        if (fs.existsSync(candidates[process.platform].paths[i])) {
            // Check if the candidate python installation meets requirements.
            const candidateData = JSON.parse(cp.execFileSync(candidates[process.platform].paths[i], ['-B', '-c', 'from __future__ import print_function; import json, sys; ' +
            'print(json.dumps({"x64": sys.maxsize > 2 ** 32, "version": str(sys.version_info[0]) + "." + str(sys.version_info[1]) + "." + str(sys.version_info[2])}))'
            ]).toString());

            if (candidateData.x64 === true) {
                if (semver.satisfies(candidateData.version, pythonVersionRange)) {

                    if (!options.silent) {
                        spinner.succeed();
                    }

                    return candidates[process.platform].paths[i];
                }
            }
        }
    }



    // No usable python installations have been found, fail.
    if (!options.silent) {
        spinner.fail();
    }

    return false;
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
    findPython: findPython,
    checkEnv: checkEnv
};
