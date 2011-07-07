{% load filters %}
var categories = {};{% for cat in category_codes %}categories["{{ cat }}"] = "{{ category_codes|get:cat }}";{% endfor %}

function buildPopup(state, category, feature, map) {
	var title = state + ": ";
	if (category == "all") {
		title += "All Themes"
	}
	else {
		title += categories[category];
	}
	
	var popup;
	if (map == null) {
		popup = new GeoExt.Popup({
			title: title,
			location: feature,
			width: 200,
			html: "Hibbity Hee, Hibbity Haw",
			maximizable: false,
			collapsible: false				
		});
	}
	else {
		popup = new GeoExt.Popup({
			title: title,
			location: feature,
			width: 200,
			html: "Hibbity Hee, Hibbity Haw",
			map: map,
			maximizable: false,
			collapsible: false				
		});
	}
	
	// Show the popup
	popup.show();
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
			renderIntent: "default"
		}
	)
	
	return theOtherClicker;
}