/*eslint-env mocha*/

const assert = require('assert');

const nodeStyle = require('../main');

describe("checkCuda.js", function() {
    describe("checkCuda", function() {
        it("Should resolve as true or false", function() {
            this.timeout(30000);
            return nodeStyle.checkCuda().then((cuda) => {
                assert.equal(typeof cuda, 'boolean');
            });
        });
    });

    describe("checkCudaSync", function() {
        this.timeout(30000);
        it("Should equal true or false", function() {
            assert.equal(typeof nodeStyle.checkCudaSync(), 'boolean');
        });
    });
});
