var err_txt = {}
	err_txt.not_in_game = "Pas de réseau. Veuillez acceder a un lieu habité."
	err_txt.horde_attacking = "L'attaque perturbe les communications."

this.K = function(){}

this.process = function(flux){
	var city = flux.headers.game["@"]
	var zone = flux.headers.owner.myZone
	var cpos = [flux.data.city["@"].x, flux.data.city["@"].y]
	var fmap  = flux.data.map

	var payload = []
	var l=fmap.zone.length
	for(i=0; i<l; ++i){
		var local = fmap.zone[i]["@"]
		var building = fmap.zone[i].building
		if(local.nvt == 0){
			payload.push(city.id+":"+local.x+"_"+local.y+":last")
			payload.push(city.days)
		}
		payload.push(city.id+":"+local.x+"_"+local.y+":tag")
		payload.push(local.tag)
		payload.push(city.id+":"+local.x+"_"+local.y+":danger")
		payload.push(local.danger)
		payload.push(city.id+":"+local.x+"_"+local.y+":type")

		if(local.x == cpos[0] && local.y == cpos[1]){
			payload.push("c")
		} else if(typeof(building) == "undefined"){
			console.log(local)
			if(local.nvt == 0){
				payload.push("t")
			} else {
				payload.push("v")
			}
		} else {
			payload.push("x")
		}
	}
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
