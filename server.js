/**
 * Module dependencies.
 */

var express = require('express')
var swig    = require('swig')
var http    = require('http')
var path    = require('path')
var rsStore = require('connect-redis')(express)
var routes  = require("./routes.js")

var app = express()
var nv = process.env

app.engine("html", swig.renderFile)
app.set('views', __dirname + "/views")
app.set('view engine', "html")
app.set('view cache', false)
swig.setDefaults({cache: false})
app.set('port', nv.PORT || 8080)
app.use(express.favicon("public/img/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("cherry pie"));
app.use(express.session({secret:"cherry pie", cookie: {maxAge: 180*1000}}));
app.use(app.router);
app.use(express.static(path.join(__dirname + '/public')));
app.use(routes.err.gotcha) // check if the error is known
app.use(routes.err.generic)// throw pretty error at the user

routes.setup(app)

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
