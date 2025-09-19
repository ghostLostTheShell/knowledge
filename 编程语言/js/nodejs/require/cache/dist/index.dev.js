"use strict";

var demoMode = require("./demoMode");

console.log(demoMode.currentDate);
demoMode = require("./demoMode");
console.log(demoMode.currentDate);
var interval = setInterval(function () {
  delete require.cache[require.resolve("./demoMode")];
  demoMode = require("./demoMode");
  console.log(demoMode.currentDate);
  clearTimeout(interval);
}, 2000);