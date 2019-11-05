/*eslint-env mocha*/

const fs = require('fs');
const assert = require('assert');

const nodeStyle = require('../main');

const python = require('../Scripts/python');

describe("checkCuda.js", function() {
    describe("checkCuda", function() {
        it("Should resolve as true or false", function() {
            if (process.env.TRAVIS) {
                this.timeout(120000);
            } else {
                this.timeout(60000);
            }
            return nodeStyle.checkCuda().then((cuda) => {
                assert.equal(typeof cuda, 'boolean');
            });
        });
    });

    describe("checkCudaSync", function() {
        if (process.env.TRAVIS) {
            this.timeout(120000);
        } else {
            this.timeout(60000);
        }
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
