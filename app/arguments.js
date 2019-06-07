/**
 * @function validateCuda
 * @param {Object} args Neural style arguments object.
 * @description Validates the cuda parameter in the args object, either passes or throws an error.
 */
function validateCuda(args) {
    /*
    Possible Cuda modes:
        yes: Require CUDA, if CUDA is not available an error will be thrown.
        no: Cuda will not be used even if it is available.
        lax: Cuda will be used if it is available, otherwise proceed without.
    */

    // Check that a cuda argument was given.
    if (args.cuda === undefined) {
        throw new Error("The cuda argument is required");
    }

    // Check that the cuda argument is a string.
    if (typeof args.cuda !== 'string') {
        throw new TypeError(`The cuda argument must be a string. Got type: ${typeof args.cuda}`);
    }

    // Check that the given cuda mode is one of the possible options.
    if (args.cuda !== "yes" || args.cuda !== "no" || args.cuda !== "lax") {
        throw new Error(`Unknown cuda mode: ${args.cuda}`);
    }
}
