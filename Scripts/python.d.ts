/// <reference type="node">

declare namespace python {
    declare interface findPythonOptions {
        /**
         * Run in silent mode.
         * @default false
         */
        readonly silent?: boolean;

        /**
         * Ignore the PYTHON environment variable when searching.
         * @default false
         */
        readonly ignoreEnv?: boolean;
    }

    /**
     * @function findPython
     * @param {Object} options
     * @param {boolean} options.silent Run in silent mode.Object
     * @param {boolean} options.ignoreEnv Ignore the PYTHON environment variable when searching.
     * @description Searches for a usable python installation from a set of predetermined locations and the PYTHON environment variable.
     * @returns {string | boolean} If a usable python installation is found a path to it is returned, otherwise false is returned.
     */    
    declare function findPython(options?: findPythonOptions): string | boolean;

    /**
     * @function checkEnv
     * @description Checks if the env directory exists.
     * @returns {Boolean} true if the env does exist and false if it doesn't.
     */
    declare function checkEnv(): boolean;
}

export = python;
