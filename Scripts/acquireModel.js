const https = require('https');
const fs = require('fs');

require('colors');

if (fs.existsSync("./torchbrain/vgg16-397923af.pth")) {
    fs.unlinkSync("./torchbrain/vgg16-397923af.pth");
}

const modelFile = fs.createWriteStream("./torchbrain/vgg16-397923af.pth.tmp");
https.get("https://download.pytorch.org/models/vgg16-397923af.pth", (res) => {
    // Pipe output to modelFile
    res.pipe(modelFile);

    // Track download progress
    let downloaded = 0;
    let max = 0;
    let progress;
    let message;
    res.on('data', (chunk) => {
        downloaded += chunk.length;
        progress = Math.floor((downloaded / res.headers['content-length']) * 100);
        message = `Download progress: ${progress}%`;
        if (message.length > max) {
            max = message.length;
        } else {
            for (var i = 0; i < max - message.length; i++) {
                message += " ";
            }
        }
        process.stdout.write(`${message}\r`);
    });

    res.on('end', () => {
        if (fs.existsSync("./torchbrain/vgg16-397923af.pth.tmp")) {
            // Rename temp file
            fs.renameSync("./torchbrain/vgg16-397923af.pth.tmp", "./torchbrain/vgg16-397923af.pth");
            console.log("\nDone!".green);
            process.exit(0);
        } else {
            console.error("Failed to download model".red);
            process.exit(1);
        }
    });
});
