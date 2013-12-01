var util = require("./util.js")

this.gotcha = function(err, req, res, next){
	switch(err.message){
		case "not_in_game":
		case "horde_attacking":
			return res.redirect("/?e="+err.message)
		default:
			return next(err)
	}
}

this.generic = function(err, req, res, next){
	tpl_val = util.mk_tpl_val(req)
	tpl_val.err = err
	console.log("### [ERROR ###")
	console.log(err)
	console.log("### ERROR] ###")
	res.render("error", tpl_val)
}
