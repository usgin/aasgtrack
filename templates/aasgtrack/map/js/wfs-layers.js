function buildWfsProtocol() {
	var thisProtocol = new OpenLayers.Protocol.WFS({
		  //url: "http://50.19.88.63/ArcGIS/services/StatePoints/MapServer/WFSServer",
		  //featureType: "State_Points",
		  srsName: "EPSG:3857",
		  url: "http://localhost:8080/geoserver/wfs",
		  featureType: "StatePoints",
		  featureNS: "http://stategeothermaldata.org/uri-gin/aasg/xmlschema/simplefeatures/",
		  geometryName: "shape"
	  });
	
	return thisProtocol;
}

function wfsPointLayer(name) {
	var filterStrategy = new OpenLayers.Strategy.Filter({
		filter : new OpenLayers.Filter.Comparison({
					   	type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
					   	property: "category",
					 	value: "all"
					 }),
	});
	
	
	var pointLayer = new OpenLayers.Layer.Vector(
		name,
		{ strategies: [ new OpenLayers.Strategy.BBOX(),
		                filterStrategy ],
		  protocol: buildWfsProtocol(),
		  styleMap: buildPointStyleMap()
		}
	);
	
	return pointLayer;
}

function wfsCenterPointLayer(name) {
	var filterStrategy = new OpenLayers.Strategy.Filter({
		filter : new OpenLayers.Filter.Comparison({
					   	type: OpenLayers.Filter.Comparison.EQUAL_TO,
					   	property: "category",
					 	value: "all"
					 }),
	});
	
	var centerPointLayer = new OpenLayers.Layer.Vector(
		name,
		{ strategies: [ new OpenLayers.Strategy.BBOX(),
		                filterStrategy ],
		  protocol: buildWfsProtocol(),
		  styleMap: buildCenterPointStyleMap()	  
		}
	);
	
	return centerPointLayer;
}

function wfsStateLayer(name) {
	var stateLayer = new OpenLayers.Layer.Vector(
		name,
		{ strategies: [ new OpenLayers.Strategy.BBOX() ],
		  protocol: new OpenLayers.Protocol.WFS({
			  srsName: "EPSG:3857",
			  url: "http://localhost:8080/geoserver/wfs",
			  featureType: "States",
			  featureNS: "http://stategeothermaldata.org/uri-gin/aasg/xmlschema/simplefeatures/",
			  geometryName: "shape"
			  
		  }),
		  styleMap: new OpenLayers.StyleMap({
			  strokeWidth: 1,
			  strokeColor: "#FAFAFA",
			  fillColor: "#BFBFBF"
		  })
		}
	);
	
	return stateLayer;
}