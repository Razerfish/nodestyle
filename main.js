const checkCuda = require('./app/checkCuda');
const torchTools = require('./app/torchTools');

module.exports = {
    checkCuda: checkCuda.checkCuda,
    checkCudaSync: checkCuda.checkCudaSync,

    torch: {
        getTorchPath: torchTools.getTorchPath
    }
}
