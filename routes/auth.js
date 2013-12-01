var access = "http://www.hordes.fr/tid/graph/me?fields=name,dead"
                +",map.fields(id,wid,hei,citizens"
                    +",zones.fields(details,items,building)"
                    +",city.fields(name)"
                +")"
var auth = require('twinauth')(access, "www.hordes.fr")

this.go = auth.go
this.back = auth.back

this.out = function(req, res, next){
    req.session.destroy()
    req.session = null
    req.json = null
    res.redirect("/")
}
this.parse = function(req, res, next){
    req.session.me = {name: req.json.name}
    if(typeof(req.json.map) == "undefined") return next()
    req.session.city = {name: req.json.map.city.name}
    next()
}
