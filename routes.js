
/*
 * GET home page.
 */

var main = require("./main.js")
var map = require("./map.js")

this.setup = function setup(app){
	app.post("/log", main.log.digest, main.log.xml, main.log.reg)

	app.get("/", main.home)
	app.get("/map/:id?", map.fetch, map.load, map.render, map.generic)
	app.get("/people/:id?", main.log.digest, main.log.xml, main.log.reg)
	app.get("/world", main.log.digest, main.log.xml, main.log.reg)
}
