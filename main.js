var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var s = require("./secret.js")
var p = new x2js.Parser()
var r = new redis.createClient()

function mk_tpl_val(req){
	tpl_val = {} 
	tpl_val.now = Date()
	if(req && req.session && req.session.me && req.session.me.name)
		tpl_val.name = req.session.me.name
	else
		tpl_val.name = "guest"

	return tpl_val
}

this.home = function(req, res){
	tpl_val = mk_tpl_val(req)
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
		res.redirect("/")
	}
}
