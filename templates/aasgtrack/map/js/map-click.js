{% load filters %}
var categories = {};{% for cat in category_codes %}categories["{{ cat }}"] = "{{ category_codes|get:cat }}";{% endfor %}
var popup;

function buildPopup(state, category, feature, map) {
	url = "/track/" + state + "/popup/" + category;
	if (category == "all") {
		url = "/track/" + state + "/popup/"
	}
	
	if (popup != null) {
		popup.close();
	}
	
	Ext.Ajax.request({
		url: url,
		method: "GET",
		success: function(result, request) {
			var title = state + ": ";
			if (category == "all") {
				title += "All Themes"
			}
			else {
				title += categories[category];
			}
			
			var popupParameters = {
				title: '<a href="/track/report/' + state + '">' + title + '</a>',
				location: feature,
				width: 250,
				html: result.responseText,
				maximizable: false,
				collapsible: false,
				panIn: false,
				anchored: false,	
			};
			
			if (map != null) 
			{
				popupParameters["map"] = map;
			}
			
			popup = new GeoExt.Popup(popupParameters);
			
			// Show the popup
			var unpin = popup.tools[0].handler;
			popup.show();
			unpin();
			
			if (map == null) {
				popup.on({
					close: function() {
						control = feature.layer.map.controls[2];
						control.unselect(feature);
					}
				});
			}
			
		},
		failure: function() {
			alert("Request failed.");
		}
	});
}

function clickResponse(feature, map) {
	var category = feature.attributes["category"];
	var state = feature.attributes["state"];
	
	//alert("State: " + state + " -- Category: "+ category);
	if (state == "ALL" && category != "all") {
		// Clicked a label point. Update the state display
		category = feature.attributes["category"];
		changeWfsStyle(category);
	}
	else if (state != "ALL") {
		// Clicked on a particular state. Popup!
		buildPopup(state, category, feature, map);
		
	}
	
}

function buildClickControl() {
	theClicker = new OpenLayers.Control.GetFeature({
		protocol: buildWfsProtocol(),
		clickTolerance: 12,
		maxFeatures: 1,
	});
	
	theClicker.events.register("featureselected", this, function(e) {
		clickResponse(e.feature, e.object.map);
	});
	
	return theClicker;
}

function buildHoverControl(layer) {
	var theHighlighter = new OpenLayers.Control.SelectFeature(
		layer,
		{
			hover: true,
			highlightOnly: true,
			renderIntent: "select"
		}
	);
	
	return theHighlighter;
}

function buildSelectClicker(layer) {
	var theOtherClicker = new OpenLayers.Control.SelectFeature(
		layer,
		{
			hover: false,
			onSelect: clickResponse,
			renderIntent: "temporary"
		}
	)
	
	return theOtherClicker;
}