
/*
 * GET home page.
 */

var main = require("./main.js")

app.get("/", main.home)
app.post("/log", main.login)
