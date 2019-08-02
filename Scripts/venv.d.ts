/// <reference type="node">

declare namespace venv {
    /**
     * @function main
     * @description Creates, prepares and installs required packages to a new virtual environment.
     */
    declare async function main(): void;



    /**
     * @function createEnv
     * @returns {Promise} Represents the eventual creation of a Python virtual environment. If successfull the promise resolves,
     * if it fails the promise rejects.
     * @description Creates a new python virtual environment at ./env and installs packages from
     * ./requirements.txt.
     */
    declare function createEnv(): Promise;



    /**
     * @function prepareEnv
     * @description Upgrades pip and setuptools to their latest versions.
     * @returns {Promise} Represents the eventual completion of upgrading pip and setuptools in the virtual environment.
     * If upgrading is successfull the promise resolves, if it fails the promise rejects.
     */
    declare function prepareEnv(): Promise;



    /**
     * @function installEnv
     * @description Installs dependencies as defined in requirements.txt.
     * @returns {Promise} Represents the eventual completion of installing dependencies into the virtual environment.
     * If package installation is successfull the promise resolves, if it fails the promise rejects.
     */
    declare function installEnv(): Promise;



    declare interface envStatus {
        /**
         * Whether or not the virtual environment fulfills the requirements described in requirements.txt.
         */
        static satisfies: boolean,

        /**
         * An array of required packages that are not installed.
         */
        static missing: Array<string>,

        /**
         * An array of packages that are of the incorrect version.
         */
        static conflicting: Array<string>
    }



    /**
     * @function verifyEnv
     * @description Check if all required packages are installed to the virtual environment.
     * @return {object} `envStatus` object.
     */
    declare function verifyEnv(): envStatus;
}

export = venv;
