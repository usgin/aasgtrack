function buildMapOptions(desiredResolution) {
	var mapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
	   controls: new OpenLayers.Control.Attribution(),
	   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
	   maxResolution: 156543.0339,
	   resolutions: [ desiredResolution ],
	   units: "m", 
     };
	
	return mapOptions;
}

function buildMaps() {
	var maps = {
			'continental': new OpenLayers.Map("continentalMap", buildMapOptions(6650)),
			'alaska': new OpenLayers.Map("alaskaMap", buildMapOptions(25650)),
			'hawaii': new OpenLayers.Map("hawaiiMap", buildMapOptions(4892)) 
	};
	
	return maps;
}

function addLayers(maps) {
	for (index in maps) {
		thisMap = maps[index];
		mapName = thisMap.name;
		
		// Layer-building functions defined in wfs-layers.js and wms-layers.js
		thisMap.addLayer(wmsBackgroundLayer(mapName + "BackgroundLayer"));
		thisMap.addLayer(wfsStateLayer(mapName + "StateLayer"));
		//thisMap.addLayer(wmsStateLayer(mapName + "StateLayer"));
		thisMap.addLayer(wfsPointLayer(mapName + "PointLayer"));
		//thisMap.addLayer(wmsPointLayer(mapName + "PointLayer"));
	}
}

function buildMapPanels(maps) {
	// Setup center coordinates for each map				
	var continentalCenterPoint = new OpenLayers.LonLat(-10691131, 4705637);
	var alaskaCenterPoint = new OpenLayers.LonLat(-16793594, 9376849);
	var hawaiiCenterPoint = new OpenLayers.LonLat(-17532836, 2356488);
	
	// Set some height and margin values
	var marginValue = 10;                     
	var alaskaHeight = 200;
	var hawaiiHeight = 125;
	
	// Build the map panels
	var continentalMapPanel = new GeoExt.MapPanel({	
        map: maps['continental'],
        title: "State Geothermal Data Contribution Status",
        center: continentalCenterPoint,
        height: 768,
        width: 1024,
        x: 0,
        y: 0,
    });
    
    var alaskaMapPanel = new GeoExt.MapPanel({
    	map: maps['alaska'],		        	
    	center: alaskaCenterPoint,
    	width: 225,
    	height: alaskaHeight,
    	x: marginValue,
    	y: continentalMapPanel.height - alaskaHeight - marginValue,
    	bodyStyle: { border: "1px solid black" },
    });
    
    var hawaiiMapPanel = new GeoExt.MapPanel({
    	map: maps['hawaii'],		        	
    	center: hawaiiCenterPoint,
    	width: 150,
    	height: hawaiiHeight,
    	x: marginValue + alaskaMapPanel.width + marginValue,
    	y: continentalMapPanel.height - hawaiiHeight - marginValue,
    	bodyStyle: { border: "1px solid black" },
    });
    
    // Return a list of panels
    var panelList = [ continentalMapPanel, alaskaMapPanel, hawaiiMapPanel ];
	return panelList;
}