this.mk_tpl_val = function mk_tpl_val(req){
	tpl_val = {} 
	tpl_val.now = Date()
	if(req && req.session && req.session.me && req.session.me.name)
		tpl_val.name = req.session.me.name 
	else
		tpl_val.name = "guest"

	return tpl_val
}
