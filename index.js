const http = require('http');
const fs = require('fs');
const requests = require('requests');

const uiFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal, orgVal)=>{
    let value = tempVal.replace("{%tempVal%}", orgVal.main.temp);
     value = value.replace("{%tempMin%}", orgVal.main.temp_min);
     value = value.replace("{%tempMax%}", orgVal.main.temp_max);
     value = value.replace("{%location%}", orgVal.name);
     value = value.replace("{%country%}", orgVal.sys.country);
     value = value.replace("{%status%}", orgVal.weather[0].main);

     return value;
}

const server = http.createServer((req, res)=>{
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Bhopal&appid=5cc1ef4967d79fdf5fc02a6646f95f87&units=metric')
        .on("data", (chunk) => {
            const dataObj = JSON.parse(chunk);
            const dataArr = [dataObj];
            // console.log(dataArr[0].main.temp);
            const realTimeData = dataArr.map((val) => replaceVal(uiFile, val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData)
        })
        .on("end", (err) => {
            if(err) return console.log("Connection closed due to error!", err);
            res.end();

        });
    }
});

server.listen(3000, "127.0.0.1");