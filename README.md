# TwitchTopStreams

Top 15 Most Viewed Twitch Channels

Live Preview 

http://52.71.247.188/

Channels are updated every 60 seconds

Packages Needed are express, mysql, request and socket.io

MySQL Table Structure

CREATE TABLE IF NOT EXISTS  `TopChannels` (

 `id` INT( 11 ) NOT NULL AUTO_INCREMENT ,
 
 `date` DATE NOT NULL ,
 
 `time` TIME NOT NULL ,
 
 `viewer_count` INT( 11 ) NOT NULL ,
 
 `name` VARCHAR( 25 ) NOT NULL ,
 
 `game` VARCHAR( 50 ) NOT NULL ,
 
 `position` INT( 11 ) NOT NULL ,
 
PRIMARY KEY (  `id` ) ,

FULLTEXT nameIdx(`name`)

) ENGINE = MyISAM;


