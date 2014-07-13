var express = require('express'),
	fs = require('fs'),
	mongodb = require('mongodb');

var app = express(),
	peerList = {},
	webPort = process.env.PORT || 2010,
	DBuri = 'mongodb://mainUser:monkeys99@ds061228.mongolab.com:61228/newswatch';

app.use(express.static(process.cwd() + '/public'));

app.on("render:index", function(encoding, req, res) {
	fs.readFile(__dirname+"/views/index.html", encoding, function(err, html) {
		res.contentType("text/html");
		res.send(200, html);
	});	
});

app.get("/", function(req, res, next) {

	app.emit("render:index", "UTF-8", req, res);

});

app.on("render:about", function(encoding, req, res) {
	fs.readFile(__dirname+"/views/about.html", encoding, function(err, html) {
		res.contentType("text/html");
		res.send(200, html);
	});	
});

app.get("/about", function(req, res, next) {

	app.emit("render:about", "UTF-8", req, res);

});


app.on("render:headLineData", function(encoding, req, res, data) {
	
	res.contentType("application/json");
	res.send(200, JSON.stringify(data));

});

app.on("get:headLineData", function(encoding, req, res) {
	mongodb.MongoClient.connect(DBuri, function(err, db) {
  		if(err) throw err;

  		var newsSources = db.collection('newsSources');
  		newsSources.find({name : "BBC UK"}).toArray(function(err, doc) {
  			app.emit("render:headLineData", "UTF-8", req, res, doc);
  		});
  	});
});

app.get("/getHeadlineData", function(req, res, next) {

	app.emit("get:headLineData", "UTF-8", req, res);

});

app.listen(webPort);