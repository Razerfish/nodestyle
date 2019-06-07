const assert = require('assert');

const nodeStyle = require('../main');
const arguments = require('../app/arguments');

describe("checkCuda.js", () => {
    describe("checkCuda", () => {
        it("Should resolve as true or false", () => {
            return nodeStyle.checkCuda().then((cuda) => {
                assert.equal(typeof cuda, 'boolean');
            });
        });
    });

    describe("checkCudaSync", () => {
        it("Should equal true or false", () => {
            assert.equal(typeof nodeStyle.checkCudaSync(), 'boolean');
        });
    });
});

describe("torchTools.js", () => {
    describe("getTorchPath", () => {
        it("Should return a string", () => {
            assert.equal(typeof nodeStyle.torch.getTorchPath(), 'string');
        });
    });
});

describe("arguments.js", () => {
    describe("validateCuda", () => {
        it("Should fail if cuda argument is missing", () => {
            assert.throws(() => {
                arguments.validateCuda({});
            }, new Error("The cuda argument is required"));
        });

        it("Should fail if the cuda argument is not a string", () => {
            assert.throws(() => {
                arguments.validateCuda({ cuda: 123456 });
            }, {
                name: 'TypeError'
            });
        });

        it("Should fail if cuda is not 'yes', 'no' or 'lax'", () => {
            assert.throws(() => {
                arguments.validateCuda({ cuda: "fail" });
            }, {
                name: 'Error'
            });
        });

        it("Should pass if cuda is 'yes'", () => {
            assert.ifError(arguments.validateCuda({ cuda: 'yes' }));
        });

        it("Should pass if cuda is 'no'", () => {
            assert.ifError(arguments.validateCuda({ cuda: 'no' }));
        });

        it("Should pass if cuda is 'lax'", () => {
            assert.ifError(arguments.validateCuda({ cuda: 'lax' }));
        });
    });
});
