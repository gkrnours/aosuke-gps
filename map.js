var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var util = require("./util.js")
var s = require("./secret.js")
var p = new x2js.Parser()
var r = new redis.createClient()

function delayRender(res, req, tpl_val){
	if(req.city && req._cellDone == req.city.size)
		res.render("map", tpl_val)
	else
		setTimeout(delayRender, 10, res, req, tpl_val)
}

function workerMap(req, tpl_val, next){
	req._cellDone = 0
	tpl_val.city = {}
	r.get(req.id+":city:name", function(err, rep){
		console.log(req.id)
		tpl_val.city.name  = rep
	})
	r.mget([req.id+":city:w", req.id+":city:h",
				req.id+"city:x", req.id+":city:y"], function(err, rep){
		req.city = {w: rep[0], h: rep[1], size: rep[0]*rep[1]}
		tpl_val.city.x = rep[2]
		tpl_val.city.y = rep[3]
		tpl_val.map = setupMap(req, 0, [])
	})
	return next()
}
function setupMap(req, step, map){
	if(step == 0){
		//build map
		for(i=0; i<req.city.h; ++i){
			map[i] = []
			map[i].y = i
			for(j=0;j <req.city.w; ++j){
				map[i][j] = {}
			}
		}
	}

	var y = step%req.city.w
	var x = Math.floor(step/req.city.w)

	var f = ["type", "last", "tag", "danger"]
	var payload = []
	for(i=0;i<f.length;++i){
		payload.push(req.id+":"+x+"_"+y+":"+f[i])
	}
	r.mget(payload, function(err, rep){
		for(i=0;i<rep.length;++i) {
			map[y][x][f[i]] = rep[i]
		}
		if(map[y][x].type == null)
			map[y][x].type = "e"
		req._cellDone += 1
	})
	if(++step < req.city.size) {
		return setupMap(req, step, map)
	}else{
		return map
	}
}

this.loadMe = function(req, res, next){
	tpl_val = util.mk_tpl_val(req)
	tpl_val.select = {map: "select"}
	if(!req.session.city || !req.session.city.cid)
		res.redirect("/world")
	req.id = req.session.city.cid
	if(!req.id) return next()
	workerMap(req, tpl_val, next)
}

this.load = function(req, res, next){
	tpl_val = util.mk_tpl_val(req)
	tpl_val.select = {wld: "select"}
	req.id = req.params.id 
	if(!req.id) return next()
	workerMap(req, tpl_val, next)
}
this.render =  function(req, res, next){
	if(!req.id) return next()
	delayRender(res, req, tpl_val)
}
this.generic =  function(req, res, next){
	tpl_val.select = {wld: "select"}
	tpl_val.keys = req.city_keys
	res.render("world", tpl_val)
}
this.gather = function(req, res, next){
	r.keys("*:city:x", function(err, rep){
		req.city_keys = rep
		console.log(rep)
		next()
	})
}
this.search = function(req, res, next){
	cid = req.body.cid
	r.get(cid+":city:x", function(err, rep){
		if(rep == null)
			res.redirect("/world")
		else
			res.redirect("/world/"+cid)
	})
}
