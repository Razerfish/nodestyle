/*eslint-env mocha*/

const fs = require('fs');
const assert = require('assert');

const nodeStyle = require('../main');

const python = require('../Scripts/python');

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


describe("python.js", function() {
    describe("checkEnv", function() {
        it("Should equal the statement: fs.existsSync(./env)", function() {
            assert.equal(python.checkEnv(), fs.existsSync("./env"));
        });
    });
});
