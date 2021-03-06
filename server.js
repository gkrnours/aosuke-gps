/**
 * Module dependencies.
 */

var express = require('express')
var rStore  = require('connect-redis')(express)
var swig    = require('swig')
var http    = require('http')
var path    = require('path')
var routes  = require('routes')
var filter  = require('./views/filter.js')
var c       = require('./db/client.js')

var app = express()
var nv = process.env

app.engine("html", swig.renderFile)
app.set('views', __dirname + "/views")
app.set('view engine', "html")
app.set('view cache', false)
swig.setDefaults({cache: false})
filter.extend(swig)
app.set('port', nv.OPENSHIFT_NODEJS_PORT || 8080)
app.set('ip',   nv.OPENSHIFT_NODEJS_IP   || null)

app.use(express.favicon("public/img/favicon.ico"))
//app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride());
app.use(express.cookieParser("cherry pie"))
app.use(express.session({store: new rStore({client: c.r}), secret:"aosuke"}))
app.use(app.router)
app.use(express.static(path.join(__dirname + '/public')))
app.use(routes.err.gotcha) // check if the error is known
app.use(routes.err.generic)// throw pretty error at the user

routes.setup(app)

http.createServer(app).listen(app.get('port'), app.get('ip'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

