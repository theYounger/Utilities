const https = require("https");
const fs = require("fs");
const ASQ = require("asynquence");
const data = require("./fhc.json");

const api = {
    hostname: "maps.googleapis.com",
    components: [
      ["locality", ""],
      ["administrative_area", ""],
    ],
    key: "AIzaSyCAKzfm4pMpRKQHVQTWjrRckEEoswYtliI",
    get pathname() {
      return `/maps/api/geocode/json?components=${api.components[0][0]}:${api.components[0][1]}|${api.components[1][0]}:${api.components[1][1]}|country:US&key=${api.key}`;
    },
};

function apiCall(i) {

    let rawData = "";
    let parsedData;
    function onResponse(res) {
        function onData(chunk) {
            rawData += chunk;
        }

        function onEnd() {
            parsedData = JSON.parse(rawData);
            if(parsedData.status !== "OK" || parsedData.results.length === 0) {
                console.log(data[i]);
                return;
            }
            var lat = parsedData.results[0].geometry.location.lat;
            var lng = parsedData.results[0].geometry.location.lng;
            var formattedAddress = parsedData.results[0].formatted_address;

            data[i].properties.formatted_address = formattedAddress;
            data[i].geometry.coordinates.push(lat);
            data[i].geometry.coordinates.push(lng);
        }

        res.on("data", onData);
        res.on("end", onEnd);
        res.resume();
    }

    // Verify location integrity
    if(data[i].geometry.coordinates.length === 0) {
        if(data[i].properties.location) {
            if(/\n/.test(data[i].properties.location)) {
                // Setup pathname
                var location = data[i].properties.location.split("\n");
                api.components[0][1] = encodeURIComponent(location[0]);
                api.components[1][1] = encodeURIComponent(location[1]);
                const opts = {
                    hostname: api.hostname,
                    path: api.pathname,
                    method: "GET",
                };
                // Client Request
                https
                    .request(opts, onResponse)
                    .end();
            }
        }
    }
}

ASQ()
.then(function(done) {
    for(let i = 0; i < data.length; i++) {
        apiCall(i);
    }
    setTimeout(function() {
        done();
    }, 10000);
})
.then(function(done) {
    const stringified = JSON.stringify(data);
    fs.writeFileSync("./fhc1.json", stringified);
    done();
});
