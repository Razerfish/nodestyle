const assert = require('assert');

const checkCuda = require('../main').checkCuda;

describe("checkCuda.js", () => {
    describe("checkCuda", () => {
        it("Should resolve as true or false", () => {
            return checkCuda.checkCuda().then((cuda) => {
                assert.equal(typeof cuda, 'boolean');
            });
        });
    });

    describe("checkCudaSync", () => {
        it("Should equal true or false", () => {
            assert.equal(typeof checkCuda.checkCudaSync(), 'boolean');
        });
    });
});
