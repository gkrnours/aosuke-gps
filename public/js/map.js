document.on('dom:loaded', function(){
    $('map').on('mouseover', "[data-items]",  function(ev, el){
        items = el.readAttribute('data-items').evalJSON()
        zeds = el.readAttribute('data-zed').evalJSON()
        console.log(zeds)
        if(items.size() == 0 && zeds <= 0) return
        tt = new Element("div", {className: "tooltip"})
        tt.insert(new Element("h4").update(zeds+" zeds"))
        tt.insert(new Element("p").update($A(items).pluck("name").join("<br>")))
        el.insert(tt)
    })
    $('map').on('mouseout', "[data-items]",  function(ev, el){
        tt = el.down('.tooltip')
        if(tt) tt.remove()
    })
})
