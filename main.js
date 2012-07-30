var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var util = require("./util.js")
var s = require("./secret.js")
var p = new x2js.Parser()
var r = new redis.createClient()

this.home = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	res.render("home", tpl_val)
}

this.log = {
	digest: function(req, res, next) {
		key = req.body.key
		aurl = "http://hordes.fr/xml/?k="+key+";sk="+s.key
		wget(aurl, function(err, rep, body) {
			if(!err && rep.statusCode == 200){
				req.xml = body
				next()
			} else if(err) {
				next(new Error("Couldn't load xml: "+err))
			} else {
				next(new Error("Couldn't load xml: error code "+rep.statusCode))
			}
		})
	},
	xml: function(req, res, next) {
		p.parseString(req.xml, function(err, result){
			if(err)
				return next(err)
			req.flux = result
			next()
		})
	},
	reg: function(req, res, next) {
		req.session.me = {
			uid: req.flux.headers.owner.citizen["@"].id,
			name:req.flux.headers.owner.citizen["@"].name
		}
		if(req.body.dbg){
			res.send([
					req.flux.headers.owner.myZone,
					req.flux.headers.game["@"],
					req.flux.data.map
					])
		}else{
			res.redirect("/")
		}
	}
}
