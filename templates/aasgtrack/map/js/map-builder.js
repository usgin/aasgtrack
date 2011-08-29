function buildMapOptions(desiredResolution) {
	var mapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
	   controls: [ new OpenLayers.Control.Attribution() ],
	   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
	   maxResolution: 156543.0339,
	   units: "m" 
     };
	if (desiredResolution) {
		   mapOptions['resolutions'] = [ desiredResolution ];
	   }
	
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
		
		// Layer-building functions defined in wfs-layers.js and wms-layers.js
		thisMap.addLayer(wmsBackgroundLayer(index + "BackgroundLayer"));
		thisMap.addLayer(wfsStateLayer(index + "StateLayer"));
		//thisMap.addLayer(wmsStateLayer(index + "StateLayer"));
		thisMap.addLayer(wmsLeaderLayer());
		thisMap.addLayer(wfsPointLayer(index + "PointLayer"));
		thisMap.addLayer(wfsCenterPointLayer(index + "CenterLayer"));
		thisMap.addLayer(wmsPointLayer(index + "LabelLayer"));
	}
}

function addClickEvent(maps) {
	for (index in maps) {
		var thisMap = maps[index];
		
		// Add the click event -- function defined in map-click.js
		var clickControl = buildClickControl();
		thisMap.addControl(clickControl);
		clickControl.activate();
	}
}

function addHoverEvent(maps) {
	for (index in maps) {
		var thisMap = maps[index];
		var theLayer;
		
		// Find the point layer
		for (alayerIndex in thisMap.layers) {
			thisLayer = thisMap.layers[alayerIndex];
			if (thisLayer.name == index + "PointLayer") {
				theLayer = thisLayer;
			}
		}
		
		var hoverControl = buildHoverControl(theLayer);
		var clickerControl = buildSelectClicker(theLayer);
		thisMap.addControl(hoverControl);
		thisMap.addControl(clickerControl);
		hoverControl.activate();
		clickerControl.activate();
	}	
}

function buildMapPanels(maps) {
	// Setup center coordinates for each map				
	var continentalCenterPoint = new OpenLayers.LonLat(-10691131, 4305637);
	var alaskaCenterPoint = new OpenLayers.LonLat(-16793594, 9376849);
	var hawaiiCenterPoint = new OpenLayers.LonLat(-17532836, 2356488);
	
	// Set some height and margin values
	var marginValue = 10;                     
	var alaskaHeight = 200;
	var hawaiiHeight = 125;
	var mapWidth = 984;
	var titleWidth = 450;
	var legendHeight = 281;
	
	// Build the map panels
	var continentalMapPanel = new GeoExt.MapPanel({	
        map: maps['continental'],
        center: continentalCenterPoint,
        height: 618,
        width: mapWidth,
        x: 0,
        y: 0,
        bodyStyle: { border: "1px solid black" }
    });
    
    var alaskaMapPanel = new GeoExt.MapPanel({
    	map: maps['alaska'],		        	
    	center: alaskaCenterPoint,
    	width: 225,
    	height: alaskaHeight,
    	x: marginValue,
    	y: continentalMapPanel.height - alaskaHeight - marginValue,
    	bodyStyle: { border: "1px solid black" }
    });
    
    var hawaiiMapPanel = new GeoExt.MapPanel({
    	map: maps['hawaii'],		        	
    	center: hawaiiCenterPoint,
    	width: 150,
    	height: hawaiiHeight,
    	x: marginValue + alaskaMapPanel.width + marginValue,
    	y: continentalMapPanel.height - hawaiiHeight - marginValue,
    	bodyStyle: { border: "1px solid black" }
    });
    
    // Build a legendPanel
    var legendPanel = new Ext.Panel({
    	id: 'legend-panel',
    	bodyStyle: { border: 'none', background: 'none'},
    	height: legendHeight,
    	width: 72,
    	x: mapWidth - 100,
    	y: continentalMapPanel.height - legendHeight - 60,
    	bodyStyle: { background: 'none', border: 'none'}
    });
    
    // Return a list of panels
    var panelList = [ continentalMapPanel, alaskaMapPanel, hawaiiMapPanel, legendPanel ];
	return panelList;
}