const assert = require('assert');

const nodeStyle = require('../main');

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
