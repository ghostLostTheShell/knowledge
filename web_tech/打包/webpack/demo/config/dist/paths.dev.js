"use strict";

var fs = require('fs');

var path = require('path');

var pojectDirectory = fs.realpathSync(process.cwd());
var context = path.join(pojectDirectory, "src");
var bulid = path.join(pojectDirectory, "bulid");
module.exports = {
  pojectDirectory: pojectDirectory,
  context: context,
  bulid: bulid
};