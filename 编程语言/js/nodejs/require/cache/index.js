let demoMode = require("./demoMode")

console.log(demoMode.currentDate);

demoMode = require("./demoMode")

console.log(demoMode.currentDate);

const interval = setInterval(() =>{

    delete require.cache[require.resolve("./demoMode")];
    demoMode = require("./demoMode");
    console.log(demoMode.currentDate);

    clearTimeout(interval);
}, 2000)