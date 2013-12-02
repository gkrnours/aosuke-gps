document.on('dom:loaded', function(){
    $('map').on('mouseover', "[data-items]",  function(ev, el){
        items = el.readAttribute('data-items').evalJSON()
        if(items.size() == 0) return
        el.insert(new Element("div", {className: "tooltip"})
                .update($A(items).pluck("name").join("<br>"))
            )
    })
    $('map').on('mouseout', "[data-items]",  function(ev, el){
        tt = el.down('.tooltip')
        if(tt) tt.remove()
    })
})
