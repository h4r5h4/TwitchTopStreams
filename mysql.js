var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rockerz",
  database: "vulcun"
});

/*con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});*/

   Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
  };

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

d = new Date();
var n = d.yyyymmdd();
var t = d.hhmmss();




var pack = {date:n, time:t , twitch_id: 1234, name: 'Artour', viewer_count:256, position:10, game:"Dota 2" };
con.query('INSERT INTO TopChannels SET ?', pack, function(err,res){
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
});