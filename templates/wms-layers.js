function wmsBackgroundLayer(name) {
	var backgroundLayer = new OpenLayers.Layer.WMS(
	    name,
	    "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
	    { layers: ["0", "1", "2"], 
	      format: "image/png" },
	    { isBackground: true }  
	);	
	
	return backgroundLayer;
}

function wmsStateLayer(name) {
    var stateLayer = new OpenLayers.Layer.WMS(
    	name,
    	"http://localhost:8080/geoserver/wms",
    	{ layers: ["aasg:StateContributionTracker"],
    	  transparent: "true" },
    	{ isBackground: false }
    );
    
    return stateLayer;
}

function wmsPointLayer(name) {
	var pointLayer = new OpenLayers.Layer.WMS(
    	name,
    	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
    	{ layers: ["2", "3", "5"],
    	  transparent: "true" },
    	{ isBackground: false }
    );
	
	return pointLayer;
}

function wmsLeaderLayer() {
	var leaderLayer = new OpenLayers.Layer.WMS(
    	"Leaders",
    	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
    	{ layers: ["0"],
    	  transparent: "true" },
    	{ isBackground: false }
    );
	
	return leaderLayer;
}