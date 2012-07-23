
/*
 * GET home page.
 */

var main = require("./main.js")

this.setup = function setup(app){
	app.get("/", main.home)
	app.post("/log", main.login)
}
