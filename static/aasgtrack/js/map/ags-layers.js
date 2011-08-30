function agsBackgroundLayer(name) {
	layer = new OpenLayers.Layer.XYZ(
			name,
			"http://50.19.88.63/ArcGIS/rest/services/WorldBackground/MapServer/tile/${z}/${y}/${x}",
			{ 
				isBaseLayer: true, 
				sphericalMercator: true,
				zoomOffset: 5,
				resolutions: [ 4891.96981024998 ]
			}
	);
	
	return layer;
}

function ags93BackgroundLayer(name) {
	layer = new OpenLayers.Layer.ArcGIS93Rest(
		name,
		"http://50.19.88.63/ArcGIS/rest/services/WorldBackground/MapServer/export",
		{
			layers: "0,1,2"			
		},
		{
			singleTile: true
		}
	);
	
	return layer;
}

function agsCacheBackgroundLayer(name) {
	layer = new OpenLayers.Layer.ArcGISCache(
			name,
			"http://50.19.88.63/ArcGIS/rest/services/WorldBackground/MapServer"
	);
	
	return layer;
}