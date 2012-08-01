var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var util = require("./util.js")
var s = require("./secret.js")
var p = new x2js.Parser()
var r = new redis.createClient()

function workerMap(req, tpl_val, next){
	req._cellDone = 0
	tpl_val.map = setupMap(req, 0, [])
	return next()
}
function delayRender(res, req, tpl_val){
	if(req._cellDone == req.session.city.w*req.session.city.h)
		res.render("map", tpl_val)
	else
		setTimeout(delayRender, 10, res, req, tpl_val)
}

function setupMap(req, step, map){
	if(step == 0){
		//build map
		for(i=0;i<req.session.city.h;++i){
			map[i] = []
			for(j=0;j<req.session.city.w;++j){
				map[i][j] = {}
			}
		}
	}

	var y = step%req.session.city.w
	var x = Math.floor(step/req.session.city.w)

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
	if(++step < req.session.city.w*req.session.city.h) {
		return setupMap(req, step, map)
	}else{
		return map
	}
}

this.load = function(req, res, next){
	tpl_val = util.mk_tpl_val(req)
	req.id = req.params.id 
	if(!req.id && req.session.city && req.session.city.cid)
		req.id = req.session.city.cid
	// if no req.id at this point, go to generic
	if(!req.id) return next()
	workerMap(req, tpl_val, next)
}
this.render =  function(req, res, next){
	if(!req.id) return next()
	delayRender(res, req, tpl_val)
}
this.generic =  function(req, res, next){
	res.render("ask_map", tpl_val)
}
