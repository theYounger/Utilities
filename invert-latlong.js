var data = require("./fhc.json");
var fs = require("fs");


for(let i = 0; i < data.length; i++) {
    var thing = data[i].geometry.coordinates.shift();
    data[i].geometry.coordinates.push(thing);
}

fs.writeFileSync("./fhc1.json", JSON.stringify(data));


