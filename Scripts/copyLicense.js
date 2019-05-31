const fs = require('fs');
require('colors');

fs.createReadStream('./torchbrain/neural_style/LICENSE').pipe(fs.createWriteStream('app/bin/torchbrain/LICENSE'));

if (fs.existsSync('app/bin/torchbrain/LICENSE')) {
    console.log("License copied successfully.".blue);
} else {
    console.error("Failed to copy license.".red);
    process.exit(1);
}
