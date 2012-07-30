var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var util = require("./util.js")
var s = require("./secret.js")
var p = new x2js.Parser()
var r = new redis.createClient()


this.fetch =  function(req, res, next) {
	id = req.params.id
	if(!id) next()
	next()
}
this.load =  function(req, res, next){
	id = req.params.id
	if(id) next()
	next()
}
this.render =  function(req, res, next){
	tpl_val = util.mk_tpl_val(req)
	tpl_val.map = []
	res.render("map", tpl_val)
}
this.generic =  function(req, res, next){}
