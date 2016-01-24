var app = require('express')();
var server = require('http').createServer(app).listen(process.env.PORT || 80);
var io = require('socket.io').listen(server);
var request = require('request');
var mysql = require("mysql");
var finalBody = '';

//DB Credentials
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rockerz",
    database: "vulcun"
});

//Remote logging
var winston = require('winston');
require('winston-loggly');

 winston.add(winston.transports.Loggly, {
    token: "5a214ed6-e600-43f1-a299-de5e19ef8101",
    subdomain: "h4r5h4",
    tags: ["Winston-NodeJS"],
    json:true
});

//Function to get Current Date in MySQL Date format
Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm > 10 ? mm : "0" + mm) + "-" + (dd > 10 ? dd : "0" + dd);
};

//Function to get Current Time in MySQL Time format
Date.prototype.hhmmss = function() {
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return (hh > 10 ? hh : "0" + hh) + ":" + (mm > 10 ? mm : "0" + mm) + ":" + (ss > 10 ? ss : "0" + ss);
};


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
});

//Sending updates every 1 minute
setInterval(function() {

//Fetch Data from Twitch API
    request('https://api.twitch.tv/kraken/streams?limit=15', function(error, response, body) {
        if (error) {
           winston.log('Request Error:', error);
        }
        if (response.statusCode !== 200) {
           winston.log('Invalid Status Code Returned:', response.statusCode);
        }
        d = new Date();
        var n = d.yyyymmdd();
        var t = d.hhmmss();
        var parsedBody = JSON.parse(body)
        finalBody = '{\"channels\":[';

        //Iterating through the JSON Object
        for (var i = 0; i < 15; i++) {
            var pos = parseInt(i + 1)
            var vCount = parsedBody.streams[i].viewers;
            var cName = parsedBody.streams[i].channel.name;
            var dName = parsedBody.streams[i].channel.display_name;
            var gName = parsedBody.streams[i].game;
            var pack = {
                date: n,
                time: t,
                viewer_count: vCount,
                name: cName,
                game: gName,
                position: pos
            };

            //Inserting fetched data into MySQL database
            con.query('INSERT INTO TopChannels SET ?', pack, function(err, res) {
                if (err) throw err;

                //console.log('Last insert ID:', res.insertId);
            });
            finalBody += "{\"name\":\"" + dName + "\", \"viewers\":" + vCount + ", \"game\":\"" + gName + "\", \"position\":" + pos + "}";
            if(pos!=15)
            finalBody += ",";
        }
        finalBody += "]}";
        //Sending data to all connected clients
        io.emit('update', finalBody);
    });
}, 60000);

//Sending data whenever a cient is connected
io.on('connection', function(socket) {
    socket.emit('new conn', finalBody);
});
