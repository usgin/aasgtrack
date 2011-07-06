{% load filters %}
var globalMap;
var g_continentalLayer;
var g_alaskaLayer;
var g_hawaiiLayer;
var g_pointLayer;

function mapEvent(event) {
	alert(globalMap.getExtent())
}

function changeStyle(category) { 
	// Set the styles argument in the WMS requests
	g_continentalLayer.params["STYLES"] = category;
	g_alaskaLayer.params["STYLES"] = category;
	g_hawaiiLayer.params["STYLES"] = category;
	
	// Redraw the map
	g_continentalLayer.redraw();
	g_alaskaLayer.redraw();
	g_hawaiiLayer.redraw();
	
	// Try redrawing the WFS Layer?
    g_pointLayer.redraw();
}	
		
Ext.onReady(function() {
	OpenLayers.ProxyHost = 'proxy?url=';
	
	// Build all the OpenLayers.Maps -- function defined in map-builder.js
	var maps = buildMaps();
	
	// Add Layers to the maps -- function defined in map-builder.js
	addLayers(maps);
	
	// Build GeoExt.MapPanels -- function defined in map-builder.js
	mapPanels = buildMapPanels(maps);		 
    
    // Category HTML
    var catHtml = ''
    {% for cat in category_codes %}
    	catHtml += "<p><a href='#' onClick='changeStyle(\"{{ cat }}\")'>{{ category_codes|get:cat }}</a></p>"
    {% endfor %}
    
	// Build the Page Layout				
	var vp = new Ext.Viewport({
        layout: "border",
        renderTo: "map",
        defaults: { autoScroll: true },			    
        items: [ { layout: "absolute",
        		   region: "center",
        		   items: mapPanels
        		},
        		{ region: "east",
        		  title: "Deliverable Categories",
	        		  html: catHtml,
	        		  width: 250,
	        		}
	        	   ]	
        });
});