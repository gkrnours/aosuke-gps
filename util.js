var err_txt = {}
	err_txt.not_in_game = "Pas de réseau. Veuillez acceder a un lieu habité."
	err_txt.horde_attacking = "L'attaque perturbe les communications."

this.K = function(){}

this.process = function(flux){
	var id = flux.headers.game["@"].id
	var zone = flux.headers.owner.myZone
	var cpos = [flux.data.city["@"].x, flux.data.city["@"].y]
	var city  = flux.data.city["@"]
	var fmap  = flux.data.map

	var payload = []
	var l=fmap.zone.length

	for(i=0; i<l; ++i){
		var local = fmap.zone[i]["@"]
		var building = fmap.zone[i].building
		if(local.nvt == 0){
			payload.push(id+":"+local.x+"_"+local.y+":last")
			payload.push(flux.headers.game["@"].days)
		}
		payload.push(id+":"+local.x+"_"+local.y+":tag")
		payload.push(local.tag)
		payload.push(id+":"+local.x+"_"+local.y+":danger")
		payload.push(local.danger)
		payload.push(id+":"+local.x+"_"+local.y+":type")
		if(local.x == cpos[0] && local.y == cpos[1])
			payload.push("c")
		else if(typeof(building) == "undefined")
			payload.push((local.nvt == 0)?"t":"v")
		else
			payload.push("x")
	}
	payload.push(id+":city:x")
	payload.push(cpos[0])
	payload.push(id+":city:y")
	payload.push(cpos[1])
	payload.push(id+":city:w")
	payload.push(fmap["@"].wid)
	payload.push(id+":city:h")
	payload.push(fmap["@"].hei)
	payload.push(id+":city:name")
	payload.push(city.city)
	return payload
}
 
this.mk_tpl_val = function mk_tpl_val(req){
	tpl_val = {} 
	tpl_val.now = Date()
	if(req && req.session) {
		if(req.session.me)
			tpl_val.me = req.session.me
		else
			tpl_val.me = {name: "Invité"}
		if(req.session.city)
			tpl_val.city = req.session.city
		else
			tpl_val.city = {name: "Ancienne Cité Oubliée"}
	}
	if(req && req.query){
		if(req.query.e)
			tpl_val.error = err_txt[req.query.e] || req.query.e
	}
	return tpl_val
}
