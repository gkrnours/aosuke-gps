var util = require('util')

function cell(c){
    console.log(c)
    if(c.z == -1) return "<e></e>"
    if(c.city) return "<c></c>"
    type = ""
    items = ""
    if(c.building)   type = "x"
    else if(c.dried) type = "d"
    else             type = "v"
    items = JSON.stringify(c.items)
    items = (items)?items.replace(/(')/g, "&#39;"):""
    return util.format("<%s data-items='%s' data-zed='%d'></%s>",
            type, items, c.z, type)
}
cell.safe=true

this.extend = function extend(swig){
    swig.setFilter('cell', cell)
}
