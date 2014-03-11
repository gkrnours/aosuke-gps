var redis  = require("redis")

var nv = process.env
var r = new redis.createClient(
		nv.OPENSHIFT_REDIS_PORT || 6379,
	 	nv.OPENSHIFT_REDIS_HOST || "127.0.0.1")
		r.auth(nv.REDIS_PASSWORD || "")

this.r = r
