var util = require('util')

function cell(c){
    if(c.z == -1) return "<e></e>"
    if(c.city) return "<c></c>"
    type = ""
    if(c.building)   type = "x"
    else if(c.dried) type = "d"
    else             type = "v"
    return util.format("<%s data-items='%s' data-zed='%d'></%s>",
            type, JSON.stringify(c.items).replace(/(')/g, "&#39;"), c.z, type)
}
cell.safe=true

this.extend = function extend(swig){
    swig.setFilter('cell', cell)
}
