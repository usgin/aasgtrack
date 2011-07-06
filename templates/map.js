{% load filters %}
var globalMap;
var g_continentalLayer;
var g_alaskaLayer;
var g_hawaiiLayer;

function mapEvent(event) {
	alert(globalMap.getExtent())
}

function changeStyle(category) { 
	// Set the styles argument in the WMS requests
	g_continentalLayer.params["STYLES"] = category;
	g_alaskaLayer.params["STYLES"] = category;
	g_hawaiiLayer.params["STYLES"] = category;
	
	// Redraw the map
	g_continentalLayer.redraw();
	g_alaskaLayer.redraw();
	g_hawaiiLayer.redraw();
}	
		
Ext.onReady(function() {
	// Build customized mapOptions for each map
	//  Setting resolutions to just one value sets the zoom-scale to that value    				   		     
	var continentalMapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
			   		   controls: new OpenLayers.Control.Attribution(),
			   		   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
			   		   maxResolution: 156543.0339,
			   		   resolutions: [ 6650 ],
			   		   units: "m", 
		   		     };
	
	var alaskaMapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
			   		   controls: new OpenLayers.Control.Attribution(),
			   		   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
			   		   maxResolution: 156543.0339,
			   		   resolutions: [ 25650 ],
			   		   units: "m", 
		   		     };
	
	var hawaiiMapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
			   		   controls: new OpenLayers.Control.Attribution(),
			   		   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
			   		   maxResolution: 156543.0339,
			   		   resolutions: [ 4891.969809375 ],
			   		   units: "m", 
		   		     };
	
	// Build all the OpenLayers.Maps    			   		     		
    var continentalMap = new OpenLayers.Map("map", continentalMapOptions);
    var alaskaMap = new OpenLayers.Map("map", alaskaMapOptions);
    var hawaiiMap = new OpenLayers.Map("map", hawaiiMapOptions);
    globalMap = hawaiiMap;
    
    // Create the background layers		
    var continentalLayer = new OpenLayers.Layer.WMS(
        "Continents: Contiguous",
        "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
        { layers: ["0", "1", "2"], 
          format: "image/png" }
    );		       
    
    var alaskaLayer = new OpenLayers.Layer.WMS(
        "Continents: Alaska",
        "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
        { layers: ["0", "1"], 
          format: "image/png" }
    );		        
    
    var hawaiiLayer = new OpenLayers.Layer.WMS(
        "Continents: Hawaii",
        "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
        { layers: ["0", "1"], 
          format: "image/png" }
    );		        
    
    // Create State foreground layers
    var continentalStateLayer = new OpenLayers.Layer.WMS(
    	"States: Contiguous",
    	"http://localhost:8080/geoserver/wms",
    	{ layers: ["aasg:StateContributionTracker"],
    	  transparent: "true" }
    );
    g_continentalLayer = continentalStateLayer;
    
    var alaskaStateLayer = new OpenLayers.Layer.WMS(
    	"States: Contiguous",
    	"http://localhost:8080/geoserver/wms",
    	{ layers: ["aasg:StateContributionTracker"],
    	  transparent: "true" }
    );
    g_alaskaLayer = alaskaStateLayer;var g_continentalLayer;
	var g_alaskaLayer;
	var g_hawaiiLayer;
	
	function mapEvent(event) {
		alert(globalMap.getExtent())
	}
	
	function changeStyle(category) { 
		// Set the styles argument in the WMS requests
		g_continentalLayer.params["STYLES"] = category;
		g_alaskaLayer.params["STYLES"] = category;
		g_hawaiiLayer.params["STYLES"] = category;
		
		// Redraw the map
		g_continentalLayer.redraw();
		g_alaskaLayer.redraw();
		g_hawaiiLayer.redraw();
	}	
			
    Ext.onReady(function() {
		// Build customized mapOptions for each map
		//  Setting resolutions to just one value sets the zoom-scale to that value    				   		     
		var continentalMapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
				   		   controls: new OpenLayers.Control.Attribution(),
				   		   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
				   		   maxResolution: 156543.0339,
				   		   resolutions: [ 6650 ],
				   		   units: "m", 
			   		     };
		
		var alaskaMapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
				   		   controls: new OpenLayers.Control.Attribution(),
				   		   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
				   		   maxResolution: 156543.0339,
				   		   resolutions: [ 25650 ],
				   		   units: "m", 
			   		     };
		
		var hawaiiMapOptions = { projection: new OpenLayers.Projection("EPSG:3857"),
				   		   controls: new OpenLayers.Control.Attribution(),
				   		   maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
				   		   maxResolution: 156543.0339,
				   		   resolutions: [ 4891.969809375 ],
				   		   units: "m", 
			   		     };
		
		// Build all the OpenLayers.Maps    			   		     		
        var continentalMap = new OpenLayers.Map("map", continentalMapOptions);
        var alaskaMap = new OpenLayers.Map("map", alaskaMapOptions);
        var hawaiiMap = new OpenLayers.Map("map", hawaiiMapOptions);
        globalMap = hawaiiMap;
        
        // Create the background layers		
        var continentalLayer = new OpenLayers.Layer.WMS(
            "Continents: Contiguous",
            "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
            { layers: ["0", "1", "2"], 
              format: "image/png" }
        );		       
        
        var alaskaLayer = new OpenLayers.Layer.WMS(
            "Continents: Alaska",
            "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
            { layers: ["0", "1"], 
              format: "image/png" }
        );		        
        
        var hawaiiLayer = new OpenLayers.Layer.WMS(
            "Continents: Hawaii",
            "http://50.19.88.63/arcgis/services/WorldBackground/MapServer/WMSServer",
            { layers: ["0", "1"], 
              format: "image/png" }
        );		        
        
        // Create State foreground layers
        var continentalStateLayer = new OpenLayers.Layer.WMS(
        	"States: Contiguous",
        	"http://localhost:8080/geoserver/wms",
        	{ layers: ["aasg:StateContributionTracker"],
        	  transparent: "true" }
        );
        g_continentalLayer = continentalStateLayer;
        
        var alaskaStateLayer = new OpenLayers.Layer.WMS(
        	"States: Contiguous",
        	"http://localhost:8080/geoserver/wms",
        	{ layers: ["aasg:StateContributionTracker"],
        	  transparent: "true" }
        );
        g_alaskaLayer = alaskaStateLayer;
        
        var hawaiiStateLayer = new OpenLayers.Layer.WMS(
        	"States: Contiguous",
        	"http://localhost:8080/geoserver/wms",
        	{ layers: ["aasg:StateContributionTracker"],
        	  transparent: "true" }
        );
        g_hawaiiLayer = hawaiiStateLayer;
        
        // Create the point maps
        var continentalPointLayer = new OpenLayers.Layer.WMS(
        	"Points: Contiguous",
        	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
        	{ layers: ["0", "1", "2", "3", "4", "5"],
        	  transparent: "true" }
        );
        
        var alaskaPointLayer = new OpenLayers.Layer.WMS(
        	"Points: Alaska",
        	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
        	{ layers: ["0", "1", "2", "3", "4", "5"],
        	  transparent: "true" }
        );
        
        var hawaiiPointLayer = new OpenLayers.Layer.WMS(
        	"Points: Hawaii",
        	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
        	{ layers: ["0", "1", "2", "3", "4", "5"],
        	  transparent: "true" }
        );		        		        
        
        // Add the foreground layer to each map
		continentalMap.addLayer(continentalStateLayer);
		alaskaMap.addLayer(alaskaStateLayer);
        hawaiiMap.addLayer(hawaiiStateLayer);
		
		// Add the point layer to each map
        continentalMap.addLayer(continentalPointLayer);
        alaskaMap.addLayer(alaskaPointLayer);
        hawaiiMap.addLayer(hawaiiPointLayer);
        
        // Add the background layer to each map
        continentalMap.addLayer(continentalLayer);		        
        alaskaMap.addLayer(alaskaLayer);
        hawaiiMap.addLayer(hawaiiLayer);
		
		// Setup center coordinates for each map				
		var continentalCenterPoint = new OpenLayers.LonLat(-10691131, 4705637);
		var alaskaCenterPoint = new OpenLayers.LonLat(-16793594, 9376849);
		var hawaiiCenterPoint = new OpenLayers.LonLat(-17532836, 2356488);
		
		// Build GeoExt.MapPanels
		var marginValue = 10;
		var alaskaHeight = 200;
		var hawaiiHeight = 125;
		
        var continentalMapPanel = new GeoExt.MapPanel({	
            map: continentalMap,
            title: "State Geothermal Data Contribution Status",
            center: continentalCenterPoint,
            height: 768,
            width: 1024,
            x: 0,
            y: 0,
        });		        		   
        
        var alaskaMapPanel = new GeoExt.MapPanel({
        	map: alaskaMap,		        	
        	center: alaskaCenterPoint,
        	width: 225,
        	height: alaskaHeight,
        	x: marginValue,
        	y: continentalMapPanel.height - alaskaHeight - marginValue,
        	bodyStyle: { border: "1px solid black" },
        });
        
        var hawaiiMapPanel = new GeoExt.MapPanel({
        	map: hawaiiMap,		        	
        	center: hawaiiCenterPoint,
        	width: 150,
        	height: hawaiiHeight,
        	x: marginValue + alaskaMapPanel.width + marginValue,
        	y: continentalMapPanel.height - hawaiiHeight - marginValue,
        	bodyStyle: { border: "1px solid black" },
        });
        
        // Category HTML
        var catHtml = ''
        {% for cat in category_codes %}
        	catHtml += "<p><a href='#' onClick='changeStyle(\"{{ cat }}\")'>{{ category_codes|get:cat }}</a></p>"
        {% endfor %}
        
		// Build the Page Layout				
		var vp = new Ext.Viewport({
	        layout: "border",
	        renderTo: "map",
	        defaults: { autoScroll: true },			    
	        items: [ { layout: "absolute",
	        		   region: "center",
	        		   items: [ continentalMapPanel,
	        		 		    alaskaMapPanel,
	        		 			hawaiiMapPanel ]
	        		},
	        		{ region: "east",
	        		  title: "Deliverable Categories",
	        		  html: catHtml,
	        		  width: 250,
	        		}
	        	   ]	
        });
    });
    
    var hawaiiStateLayer = new OpenLayers.Layer.WMS(
    	"States: Contiguous",
    	"http://localhost:8080/geoserver/wms",
    	{ layers: ["aasg:StateContributionTracker"],
    	  transparent: "true" }
    );
    g_hawaiiLayer = hawaiiStateLayer;
    
    // Create the point maps
    var continentalPointLayer = new OpenLayers.Layer.WMS(
    	"Points: Contiguous",
    	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
    	{ layers: ["0", "1", "2", "3", "4", "5"],
    	  transparent: "true" }
    );
    
    var alaskaPointLayer = new OpenLayers.Layer.WMS(
    	"Points: Alaska",
    	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
    	{ layers: ["0", "1", "2", "3", "4", "5"],
    	  transparent: "true" }
    );
    
    var hawaiiPointLayer = new OpenLayers.Layer.WMS(
    	"Points: Hawaii",
    	"http://50.19.88.63/arcgis/services/StatePoints/MapServer/WMSServer",
    	{ layers: ["0", "1", "2", "3", "4", "5"],
    	  transparent: "true" }
    );		        		        
    
    // Add the foreground layer to each map
	continentalMap.addLayer(continentalStateLayer);
	alaskaMap.addLayer(alaskaStateLayer);
    hawaiiMap.addLayer(hawaiiStateLayer);
	
	// Add the point layer to each map
    continentalMap.addLayer(continentalPointLayer);
    alaskaMap.addLayer(alaskaPointLayer);
    hawaiiMap.addLayer(hawaiiPointLayer);
    
    // Add the background layer to each map
    continentalMap.addLayer(continentalLayer);		        
    alaskaMap.addLayer(alaskaLayer);
    hawaiiMap.addLayer(hawaiiLayer);
	
	// Setup center coordinates for each map				
	var continentalCenterPoint = new OpenLayers.LonLat(-10691131, 4705637);
	var alaskaCenterPoint = new OpenLayers.LonLat(-16793594, 9376849);
	var hawaiiCenterPoint = new OpenLayers.LonLat(-17532836, 2356488);
	
	// Build GeoExt.MapPanels
	var marginValue = 10;
	var alaskaHeight = 200;
	var hawaiiHeight = 125;
	
    var continentalMapPanel = new GeoExt.MapPanel({	
        map: continentalMap,
        title: "State Geothermal Data Contribution Status",
        center: continentalCenterPoint,
        height: 768,
        width: 1024,
        x: 0,
        y: 0,
    });		        		   
    
    var alaskaMapPanel = new GeoExt.MapPanel({
    	map: alaskaMap,		        	
    	center: alaskaCenterPoint,
    	width: 225,
    	height: alaskaHeight,
    	x: marginValue,
    	y: continentalMapPanel.height - alaskaHeight - marginValue,
    	bodyStyle: { border: "1px solid black" },
    });
    
    var hawaiiMapPanel = new GeoExt.MapPanel({
    	map: hawaiiMap,		        	
    	center: hawaiiCenterPoint,
    	width: 150,
    	height: hawaiiHeight,
    	x: marginValue + alaskaMapPanel.width + marginValue,
    	y: continentalMapPanel.height - hawaiiHeight - marginValue,
    	bodyStyle: { border: "1px solid black" },
    });
    
    // Category HTML
    var catHtml = ''
    {% for cat in category_codes %}
    	catHtml += "<p><a href='#' onClick='changeStyle(\"{{ cat }}\")'>{{ category_codes|get:cat }}</a></p>"
    {% endfor %}
    
	// Build the Page Layout				
	var vp = new Ext.Viewport({
        layout: "border",
        renderTo: "map",
        defaults: { autoScroll: true },			    
        items: [ { layout: "absolute",
        		   region: "center",
        		   items: [ continentalMapPanel,
        		 		    alaskaMapPanel,
        		 			hawaiiMapPanel ]
        		},
        		{ region: "east",
        		  title: "Deliverable Categories",
        		  html: catHtml,
        		  width: 250,
        		}
        	   ]	
    });
});