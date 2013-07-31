
/*
 * GET home page.
 */

/var main = require("./main.js")
//var map  = require("./map.js")
this.err = require("./error.js")

this.setup = function setup(app){
	app.post("/log", main.log.digest, main.log.xml, main.log.reg)
	app.post("/login/post", main.log.digest, main.log.xml, main.log.reg)

	app.get("/", main.home)
	app.get("/map", map.loadMe, map.render, map.generic)
	app.get("/world/:id?", map.gather, map.load, map.render, map.generic)
	app.post("/world", map.search)
	app.get("/people/:id?", main.home)
}


