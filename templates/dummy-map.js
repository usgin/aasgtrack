Ext.onReady(function() {
	OpenLayers.ProxyHost = 'proxy?url=';
	
	// Base Layer (WMS)
	var continentalLayer = new OpenLayers.Layer.WMS(
        "Continents: Contiguous",
        "http://50.19.88.63/ArcGIS/services/GeologicMapOfArizona/MapServer/WMSServer",
        { layers: ["0", "1", "2"], 
          format: "image/png",
          transparent: "true",
        },
      	{ 
        	isBackground: false,
      	}
    );
	
	gSatLayer = new OpenLayers.Layer.Google("Google", {"sphericalMercator": true,projection: new OpenLayers.Projection("EPSG:3857")});
	continentalLayer.setOpacity(.50);

	mapOptions = {
		    maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
		    numZoomLevels:18,
		    maxResolution:156543.0339,
		    units:'m',
		    projection: new OpenLayers.Projection("EPSG:3857"),
		}
	
	// Build the Map
	var theMap = new OpenLayers.Map(
		"theMap",
		mapOptions
	);
	
	theMap.addLayer(continentalLayer);
	theMap.addLayer(gSatLayer);
	
	// Build the Map Panel	
	var theMapPanel = new GeoExt.MapPanel({
		map: theMap,
		title: "Dummy Map",
		region: "center",
		center: new OpenLayers.LonLat(-10691131, 4705637),
		zoom: 7
	});
	
	// Layout the Page
	var vp = new Ext.Viewport({
		layout: "border",
		renderTo: "map",
		items: [ theMapPanel ]
	});
});