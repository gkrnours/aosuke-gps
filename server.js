/**
 * Module dependencies.
 */

console.log(__dirname)
var fs = require("fs")
var express = require("express")
var template= require("consolidate")
var routes  = {index: function(req, res){ 
		res.render('index', {title:"Express"}) 
	} 
}
var http = require("http")

var app = express()
var views_dir = __dirname+"/data/views"

app.configure(function(){
	require("swig").init({cache: false, root: views_dir})
	app.engine("html", template.swig)
	app.set("view engine", "html")
	app.set("views", views_dir)

	app.use(express.static(__dirname + '/public'));
	app.use("/css", express.static(__dirname+"/data/css"))
	app.use("/img", express.static(__dirname+"/data/img"))
	app.use("/js",  express.static(__dirname+"/data/js"))

	app.use(express.favicon("data/img/favicon.ico"));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(process.env["port"] || 3000, function() {
	console.log("Express server listening on port " + app.get('port'));
});
