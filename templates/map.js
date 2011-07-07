{% load filters %}
var g_stateLayers = {};

function mapEvent(event) {
	alert(globalMap.getExtent())
}

function changeWmsStyle(category) { 
	// Set the styles argument in the WMS requests
	for (layer in g_stateLayers) {
		g_stateLayers[layer].params["STYLES"] = category;
		g_stateLayers[layer].redraw();
	}
}

function changeWfsStyle(category) {
	for (layer in g_stateLayers) {
		g_stateLayers[layer].styleMap = buildStateStyleMap(category);
		g_stateLayers[layer].redraw();
	}
}
		
Ext.onReady(function() {
	OpenLayers.ProxyHost = 'proxy?url=';
	
	// Build all the OpenLayers.Maps -- function defined in map-builder.js
	var maps = buildMaps();
	
	// Add Layers to the maps -- function defined in map-builder.js
	addLayers(maps);
	
	// Set global layers for re-styling later
	for (mapName in maps) {
		for (layerIndex in maps[mapName].layers) {
			var layer = maps[mapName].layers[layerIndex];
			if (layer.name == mapName + "StateLayer") {
				g_stateLayers[mapName] = layer;
			}
		}
	}	
	
	// Build GeoExt.MapPanels -- function defined in map-builder.js
	mapPanels = buildMapPanels(maps);		 
    
    // Category HTML
    var catHtml = ''
    {% for cat in category_codes %}
    	catHtml += "<p><a href='#' onClick='changeWfsStyle(\"{{ cat }}\")'>{{ category_codes|get:cat }}</a></p>"
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