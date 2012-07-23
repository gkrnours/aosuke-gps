
/*
 * GET home page.
 */

var express = require("express")
var main = require("./main.js")
var app = express()

app.get("/", main.home)
app.post("/log", main.login)
