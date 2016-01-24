var app = require('express')();
var server = require('http').createServer(app).listen(process.env.PORT || 80);
var io = require('socket.io').listen(server);
var request = require('request');
var mysql = require("mysql");
var char = '';

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rockerz",
  database: "vulcun"
});



Date.prototype.yyyymmdd = function() {
var yyyy = this.getFullYear().toString();
var mm = (this.getMonth()+1).toString();
var dd  = this.getDate().toString();
return yyyy + "-" + (mm>10?mm:"0"+mm) + "-" + (dd>10?dd:"0"+dd);
};
Date.prototype.hhmmss = function() {
var hh = this.getHours().toString();
var mm = this.getMinutes().toString();
var ss  = this.getSeconds().toString();
return (hh>10?hh:"0"+hh) + ":" + (mm>10?mm:"0"+mm) + ":" + (ss>10?ss:"0"+ss);
};




app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

setInterval(function() {

request('https://api.twitch.tv/kraken/streams?limit=15', function (error, response, body) {
    if(error){
        return console.log('Error:', error);
    }
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    d = new Date();
    var n = d.yyyymmdd();
    var t = d.hhmmss();
    var parsedBody = JSON.parse(body)
    char = '';
    for(var i=0;i<15;i++){
      var pos = parseInt(i+1)
      console.log(pos);
      var pack = {date:n, time:t, viewer_count:parsedBody.streams[i].viewers, name: parsedBody.streams[i].channel.name,game:parsedBody.streams[i].game, position:pos};
      con.query('INSERT INTO TopChannels SET ?', pack, function(err,res){
        if(err) throw err;
      
        console.log('Last insert ID:', res.insertId);
      });
    char += parsedBody.streams[i].channel.name + "," + parsedBody.streams[i].viewers + "," + parsedBody.streams[i].game + "<br>";
   }
io.emit('update', char);
});
}, 60000);

io.on('connection', function(socket){
  socket.emit('new conn', char);
  //console.log(char);
});
