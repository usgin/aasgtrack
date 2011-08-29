{% load filters %}
var g_stateLayers = {};
var g_pointLayers = {};
var g_maps = {};
var panels;

function changeWfsStyle(category) {	
	// Change the state's colors
	for (layer in g_stateLayers) {
		g_stateLayers[layer].styleMap = buildStateStyleMap(category);
		g_stateLayers[layer].redraw();
	}
	
	// Change the legend panel
	panels[panels.length - 1].body.applyStyles({ background: 'url("{{ static_url }}aasgtrack/img/' + category + '-legend.png")' });
}
		
function init() {
	OpenLayers.ProxyHost = 'proxy?url=';
	
	// Build all the OpenLayers.Maps -- function defined in map-builder.js
	g_maps = buildMaps();
	
	// Add Layers to the maps -- function defined in map-builder.js
	addLayers(g_maps);
	
	// Set global layers for re-styling later
	for (mapName in g_maps) {
		for (layerIndex in g_maps[mapName].layers) {
			var layer = g_maps[mapName].layers[layerIndex];
			if (layer.name == mapName + "StateLayer") {
				g_stateLayers[mapName] = layer;
			}
			else if (layer.name == mapName + "PointLayer") {
				g_pointLayers[mapName] = layer;
			}
		}
	}
	
	// Add the function for handling point-click events -- function defined in map-builder.js
	addClickEvent(g_maps);
	
	// Add the function for highlighting points as you hover on them
	addHoverEvent(g_maps);
	
	// Build GeoExt.MapPanels -- function defined in map-builder.js
	panels = buildMapPanels(g_maps);		     
	
	// Build the Page Layout				
	var vp = new Ext.Viewport({
        layout: "border",
        renderTo: "map",
        defaults: { autoScroll: true },			    
        items: [ 
                 { 
                	 layout: "absolute",
                	 region: "center",
                	 items: panels,
                	 bodyStyle: 'border: none;'
        		 }
        ], 	  
	});
};