{% load filters %}
var g_stateThemes = {{ colors|safe }};

function buildStateStyleMap(category) {
	// Given a category, build an OpenLayers.StyleMap with appropriate styling rules based on database content
	var colors = g_stateThemes[category];
	
	theStyleMap = new OpenLayers.StyleMap({
		strokeWidth: 1,
		strokeColor: "#FAFAFA"
	});
	
	theStyleMap.addUniqueValueRules("default", "abbreviation", colors);
	
	return theStyleMap;
}

function buildPointStyleMap() {
	// Create the StyleMap with the only default value: line color
	var defaultStyle = new OpenLayers.Style({
		strokeWidth: 1,
		strokeColor: "#000000",
		fillColor: "#999999",
		pointRadius: 4
	});
	
	var selectStyle = new OpenLayers.Style({
		strokeWidth: 4,
		strokeColor: "#FFFF00",
		pointRadius: 5
	});
	
	var tempStyle = new OpenLayers.Style({
		strokeWidth: 4,
		strokeColor: "#37FDFC",
		pointRadius: 5
	})
	
	var theStyleMap = new OpenLayers.StyleMap({
		"default": defaultStyle,
		"select": selectStyle,
		"temporary": tempStyle
	});
	
	// Create rules that are database contingent, based on the g_stateThemes above
	{% for cat in category_codes %}
		for (state in g_stateThemes["{{ cat }}"]) {
			// Generate the color this point should be. If the value in g_stateThemes is not default #BFBFBF, then they
			//  have some deliverables in that category that are completed
			var thisSymbolizer = {};
			if (g_stateThemes["{{ cat }}"][state]["fillColor"] != "#BFBFBF") {
				thisSymbolizer["fillColor"] = "{{ root_colors|get:cat }}";
			}
			else {
				thisSymbolizer["strokeWidth"] = 0;
			}
			
			// Build the rule that is actually two filter criteria combined by AND
			var thisRule = new OpenLayers.Rule({
				filter: new OpenLayers.Filter.Logical({
					type: OpenLayers.Filter.Logical.AND,
					filters: [
					    new OpenLayers.Filter.Comparison({
					    	type: OpenLayers.Filter.Comparison.EQUAL_TO,
					    	property: "state",
					    	value: state
					    }),
					    new OpenLayers.Filter.Comparison({
					    	type: OpenLayers.Filter.Comparison.EQUAL_TO,
					    	property: "category",
					    	value: "{{ cat }}"
					    })
					]
				}),
				symbolizer: thisSymbolizer
			});
			
			// Append the rule to the set
			theStyleMap.styles["default"].addRules([ thisRule ]);
		}
		
		// Also add the appropriate rule for the legend point
		var thisRule = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Logical({
				type: OpenLayers.Filter.Logical.AND,
				filters: [
				    new OpenLayers.Filter.Comparison({
				    	type: OpenLayers.Filter.Comparison.EQUAL_TO,
				    	property: "state",
				    	value: "ALL"
				    }),
				    new OpenLayers.Filter.Comparison({
				    	type: OpenLayers.Filter.Comparison.EQUAL_TO,
				    	property: "category",
				    	value: "{{ cat }}"
				    })
				]
			}),
			symbolizer: { fillColor: "{{ root_colors|get:cat }}"}
		});
		
		// Append the rule to the set
		theStyleMap.styles["default"].addRules([ thisRule ]);
	{% endfor %}
		
	return theStyleMap;	
}

function buildCenterPointStyleMap(useLabels, labelString) {
	var options = {
			strokeWidth: 1,
			strokeColor: "#000000",
			fillColor: "#FFFFFF",
			pointRadius: 9
		};
	
	if (useLabels) { 
		options['label'] = labelString; 
		options['fontSize'] = '11px'
	}
	
	var defaultStyle = new OpenLayers.Style(options);
	
	var theStyleMap = new OpenLayers.StyleMap(defaultStyle);
	return theStyleMap;
}