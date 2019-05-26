const checkCuda = require('./checkCuda');

module.exports = {
    checkCuda: {
        checkCuda: checkCuda.checkCuda,
        checkCudaSync: checkCuda.checkCudaSync
    }
}
