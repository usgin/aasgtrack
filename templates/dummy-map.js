Ext.onReady(function() {
	OpenLayers.ProxyHost = 'proxy?url=';
	
	// Base Layer (WMS)
	var continentalLayer = new OpenLayers.Layer.WMS(
        "Continents: Contiguous",
        "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
        { layers: ["0", "1", "2"], 
          format: "image/png" }
    );
	
	// Point Layer (WFS)
	var pointLayer = new OpenLayers.Layer.Vector(
		"StatePoints",
		{ strategies: [ new OpenLayers.Strategy.BBOX() ],
		  protocol: new OpenLayers.Protocol.WFS({
			  //url: "http://50.19.88.63/ArcGIS/services/StatePoints/MapServer/WFSServer",
			  //featureType: "State_Points",
			  srsName: "urn:ogc:def:crs:EPSG:6.9:3857",
			  url: "http://localhost:8080/geoserver/wfs",
			  featureType: "StatePoints",
			  //featureType: "StateContributionTracker",
			  featureNS: "http://stategeothermaldata.org/uri-gin/aasg/xmlschema/simplefeatures/",
			  geometryName: "shape"
			  
		  }),
		  styleMap: new OpenLayers.StyleMap({
			  strokeWidth: 3,
			  strokeColor: "#333333",
			  fillColor: "#AAAAAA",
			  pointRadius: 10,
		  })
		}
	);
	
	// Build the Map
	var theMap = new OpenLayers.Map(
		"theMap",
		{
			projection: new OpenLayers.Projection("EPSG:3857"),
			maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
	   		maxResolution: 156543.0339,
	   		units: "m"
		}
	);
	
	// Add layers to the map
	theMap.addLayer(continentalLayer);
	theMap.addLayer(pointLayer);
	
	// Build the Map Panel
	var theMapPanel = new GeoExt.MapPanel({
		map: theMap,
		title: "Dummy Map",
		region: "center"
	});
	
	// Layout the Page
	var vp = new Ext.Viewport({
		layout: "border",
		renderTo: "map",
		items: [ theMapPanel ]
	});
});