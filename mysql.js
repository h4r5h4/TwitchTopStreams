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

var pack = { twitch_id: 1234, name: 'Artour', viewer:count:256, position:10, game:"Dota 2" };
con.query('INSERT INTO TopChannels SET ?', pack, function(err,res){
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
});