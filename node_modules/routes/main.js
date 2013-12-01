var util = require("./util.js")


this.home = function(req, res){
	console.log(req.headers.host)
	tpl_val = util.mk_tpl_val(req)
	res.render("home", tpl_val)
}

