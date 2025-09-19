const fs = require('fs');
const path = require('path');

const pojectDirectory = fs.realpathSync(process.cwd());

const context = path.join(pojectDirectory, "src")

const bulid = path.join(pojectDirectory, "bulid")
module.exports = {
    pojectDirectory,
    context,
    bulid
}