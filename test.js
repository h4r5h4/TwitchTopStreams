var app = require('express')();
var server = require('http').createServer(app).listen(process.env.PORT || 80);
var io = require('socket.io').listen(server);
var request = require('request');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

setInterval(function() {

request('https://api.twitch.tv/kraken/streams?limit=15', function (error, response, body) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }

    //All is good. Print the body
    var parsedBody = JSON.parse(body)
    var i;
    for(i in parsedBody.streams){
 io.emit('update', parsedBody.streams[i].channel.display_name + "," + parsedBody.streams[i].viewers + "," + parsedBody.streams[i].game);  }  
//console.log(parsedBody.streams[i].channel.display_name + "," + parsedBody.streams[i].viewers + "," + parsedBody.streams[i].game); }// Show the HTML for the Modulus homepage.

});
   

       
    
}, 5000);

