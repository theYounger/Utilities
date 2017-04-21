var https = require("https");

function onResponse(res) {
    function onData(chunk) {
        rawData += chunk;
    }
    function onEnd() {
        console.log(rawData);
    }
    var rawData = "";
    res
        .on("data", onData)
        .on("end", onEnd);
}

var api = {
    hostname: "maps.googleapis.com",
    components: [
      ["locality", "Charlotte"],
      ["administrative_area", "NC"],
      ["country", "US"]
    ],
    key: "AIzaSyCAKzfm4pMpRKQHVQTWjrRckEEoswYtliI",
    get pathname() {
      return `/maps/api/geocode/json?components=${api.components[0][0]}:${api.components[0][1]}|${api.components[1][0]}:${api.components[1][1]}|${api.components[2][0]}:${api.components[2][1]}&key=${api.key}`;
    },
};

var opts = {
    hostname: api.hostname,
    path: api.pathname,
    method: "GET",
};

https
    .request(opts, onResponse)
    .end();