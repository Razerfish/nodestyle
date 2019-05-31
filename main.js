const checkCuda = require('./app/checkCuda');

module.exports = {
    checkCuda: checkCuda.checkCuda,
    checkCudaSync: checkCuda.checkCudaSync
}
