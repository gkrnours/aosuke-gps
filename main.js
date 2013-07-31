var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var util = require("./util.js")
var s = require("./secret.js")
var p = new x2js.Parser()
var r
console.log(process.env.RSPORT+"@main.js")
try{
	r = new redis.createClient(process.env.RSPORT)
  r.auth(process.env.RSAUTH)
} catch(e){
	console.warn(e)
}

this.home = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	res.render("home", tpl_val)
}

this.log = {
	digest: function(req, res, next) {
		key = req.body.key
		aurl = "http://hordes.fr/xml/?k="+key+";sk="+s.key
		req.preXml = new Date()
		wget(aurl, function(err, rep, body) {
			req.loadXml = new Date() - req.preXml
			console.log(req.loadXml)
			if(!err && rep.statusCode == 200){
				req.xml = body
				return next()
			} else if(err) {
				return next(new Error("Couldn't load xml: "+err))
			} else {
				return next(new Error("Couldn't load xml: error code "+rep.statusCode))
			}
		})
	},
	xml: function(req, res, next) {
		p.parseString(req.xml, function(err, result){
			if(err)
				return next(err)
			if(result.error){
				return next(new Error(result.error["@"].code))
			}
			req.flux = result
			next()
		})
	},
	reg: function(req, res, next) {
		req.session.me = {
			uid: req.flux.headers.owner.citizen["@"].id,
			name:req.flux.headers.owner.citizen["@"].name
		}
		req.session.city = {
			name: req.flux.data.city["@"].city,
			cid: req.flux.headers.game["@"].id,
			x: req.flux.data.city["@"].x,
			y: req.flux.data.city["@"].y,
			w: req.flux.data.map["@"].wid,
			h: req.flux.data.map["@"].hei
		}
		r.mset(util.process(req.flux), util.K)

		if(req.body.dbg == 1){
			res.send([
					req.flux.headers.owner.myZone,
					req.flux.headers.game["@"],
					req.flux.data.city["@"],
					req.flux.data.map["@"]
					//req.flux.data.map
					])
		}else{
			res.redirect("/")
		}
	}
}
