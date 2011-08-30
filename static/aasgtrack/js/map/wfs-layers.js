function buildWfsProtocol() {
	var thisProtocol = new OpenLayers.Protocol.WFS({
		  srsName: "EPSG:3857",
		  url: "http://localhost:8080/geoserver/wfs",
		  featureType: "StatePoints",
		  featureNS: "http://stategeothermaldata.org/uri-gin/aasg/xmlschema/simplefeatures/",
		  geometryName: "shape"
	  });
	
	return thisProtocol;
}

function wfsPointLayer(name, strategy) {
	var filterStrategy = new OpenLayers.Strategy.Filter({
		filter : new OpenLayers.Filter.Comparison({
					   	type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
					   	property: "category",
					 	value: "all"
					 })
	});
	
	if (strategy) { filterStrategy = strategy };	
	
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

function wfsCenterPointLayer(name, strategy, useLabels, labelString) {
	var filterStrategy = new OpenLayers.Strategy.Filter({
		filter : new OpenLayers.Filter.Comparison({
					   	type: OpenLayers.Filter.Comparison.EQUAL_TO,
					   	property: "category",
					 	value: "all"
					 })
	});
	
	if (strategy) { filterStrategy = strategy };
	if (useLabels) { thisStyleMap = buildCenterPointStyleMap(true, labelString) }
	else { thisStyleMap = buildCenterPointStyleMap() }
	
	var centerPointLayer = new OpenLayers.Layer.Vector(
		name,
		{ strategies: [ new OpenLayers.Strategy.BBOX(),
		                filterStrategy ],
		  protocol: buildWfsProtocol(),
		  styleMap: thisStyleMap	  
		}
	);
	
	return centerPointLayer;
}

function wfsStateLayer(name, strategy, onlyBoundaries) {
	var wfsStrategies = [ new OpenLayers.Strategy.BBOX() ];
	if (strategy) {
		wfsStrategies[1] = strategy;
	}
	
	var stateStyle = new OpenLayers.StyleMap({
		  strokeWidth: 1,
		  strokeColor: "#FAFAFA",
		  fillColor: "#BFBFBF"
	  });
	if (onlyBoundaries) {
		stateStyle = new OpenLayers.StyleMap({
			  strokeWidth: 1,
			  strokeColor: "#C0C0C0",
			  fillOpacity: 0
		  });
	}
	var stateLayer = new OpenLayers.Layer.Vector(
		name,
		{ strategies: wfsStrategies,
		  protocol: new OpenLayers.Protocol.WFS({
			  srsName: "EPSG:3857",
			  url: "http://localhost:8080/geoserver/wfs",
			  featureType: "States",
			  featureNS: "http://stategeothermaldata.org/uri-gin/aasg/xmlschema/simplefeatures/",
			  geometryName: "shape"
			  
		  }),
		  styleMap: stateStyle
		}
	);
	
	return stateLayer;
}