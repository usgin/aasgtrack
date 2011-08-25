var thisMap;
var otherMap;

function makeSummaryGridPanel() {
	// Create the grouping data store
	var store = new Ext.data.GroupingStore({
		reader: metricsReader, // defined in metrics-data.js
		url: summaryUrl, //defined in state-report.html
		groupField: 'state_name'
	});
	
	// Load the store
	store.load();
	
	// Make the Data Grid
	var grid = new Ext.grid.GridPanel({
		store: store,
		frame: true,
		enableColumnHide: false,
		title: summaryTitle, //defined in state-report.html
		region: 'north',
		columns: metricsColumns, // defined in metrics-data.js
		view: metricsGroupView, // defined in metrics-data.js
		height: 275
	});
	
	return grid;
}

function makeMainGridPanel() {
	// Create a reader
	var reader = new Ext.data.JsonReader({
		root: 'rows',
		totalProperty: 'results',
		fields: [
		    {name: 'state'},     
		    {name: 'deliverableId'},
		    {name: 'deliverableYear'},
		    {name: 'deliverableName'},
		    {name: 'deliverableDef'},
		    {name: 'deliverablePlan'},
		    {name: 'deliverableCategory'},
		    {name: 'submissionFile'},
		    {name: 'submissionStatus'},
		    {name: 'submissionStatDate', type: 'date', dateFormat: 'Y-m-d'},
		    {name: 'submissionSubDate', type: 'date', dateFormat: 'Y-m-d'},
		    {name: 'submissionComments'},
		    {name: 'submissionTitle'},
		    {name: 'noExpansion'}
		]
	});
	
	// Create a #@$!!&^-ing template for the expander
	var thisTpl = new Ext.XTemplate('<p style="padding-left:25px;"><span style="font-weight: bold;">File Name:</span> {submissionFile}',
									'<p style="padding-left:25px; font-weight: bold;">Comments:</p>', 
									'<tpl for="submissionComments">', 
									'<p style="padding-left:30px;"> -- {.}</p>', 
									'</tpl>'
	);
	
	// Create another template for the Grouper
	var otherTpl = new Ext.XTemplate('{gvalue}');
	
	// Create Four data stores, one for each project year. Load them.
	// Generate GridPanels within the same loop
	stores = [];
	gridPanels = [];
	yearLookup = { 1: 'Year One', 2: 'Year Two', 3: 'Year Three', 4: 'Supplemental'}
	for (i=0; i<=3; i++) {
		// Create the store
		stores[i] = new Ext.data.GroupingStore({
			reader: reader,
			url: theUrl + '&year=' + parseInt(i + 1),
			groupField: 'deliverableName'
		});
		
		// Load the store
		stores[i].load();
		
		// Create the GridPanel
		gridPanels[i] = new Ext.grid.GridPanel({
			store: stores[i],
			title: yearLookup[i+1] + " Deliverables",
			enableColumnHide: false,
			frame: true,
			columns: [
			    {id: 'deliverableName', header: 'Deliverable', sortable: true, dataIndex: 'deliverableName', hidden: true},
			    {id: 'submissionTitle', header: 'Title', sortable: true, dataIndex: 'submissionTitle', css: 'font-weight: bold;'},
			    {id: 'submissionSubDate', header: 'Submitted On', sortable: true, dataIndex: 'submissionSubDate', renderer: Ext.util.Format.dateRenderer('M j, Y')},
			    {id: 'submisionStatus', header: 'Status', sortable: true, dataIndex: 'submissionStatus'}		
			],
			view: new Ext.grid.GroupingView({
				forceFit: true,
				//groupTextTpl: '{[ values.rs[0].data["deliverableName"] ]} ({[ values.rs[0].data["deliverableCategory"] ]})',
				groupTextTpl: '{gvalue}',
				//groupTextTpl: otherTpl,
				hideGroupedColumn: true,
				enableNoGroups: false,
				enableGroupingMenu: false,
				showPreview: true,
				enableRowBody: true,
				getRowClass: function(record, rowIndex, rp, ds){
			        if (record.data['noExpansion']) {
			        	rp.body = '';
			        	return '';			        		
			        }
			        else {
			        	rp.body = thisTpl.apply(record.data);
			        	rp.bodyStyle = 'background: white;';
				        return 'submission-row';
			        }
			    }
			})
		});
	}
	
	// Build the accordion
	var accordion = new Ext.Panel({
		title: subTitle, // defined in state-report.html template
		layout: 'accordion',
		region: 'center',
		frame: true,
		margins: '5 0 0 0',
		region: 'center',
		layoutConfig: {
			animate: false,
			hideCollapseTool: true
		},
		items: gridPanels
	});
	
	return accordion;
	
	// Make the Data Grid
	//var grid = new Ext.grid.GridPanel({
	//	store: store,
		//frame: true,
	//	margins: '5 0 0 0',
	//	title: subTitle, // defined in state-report.html template
	//	region: 'center',
	//	frame: true,
	//	enableColumnHide: false,
	//	columns: [
	//	    expander,
	//	    {id: 'deliverableName', header: 'Deliverable', sortable: true, dataIndex: 'deliverableName', hidden: true},
	//	    {id: 'submissionTitle', header: 'Title', sortable: true, dataIndex: 'submissionTitle'},
	//	    //{id: 'submissionFile', header: 'File Name', sortable: true, dataIndex: 'submissionFile'},
	//	    {id: 'submissionSubDate', header: 'Submitted On', sortable: true, dataIndex: 'submissionSubDate', renderer: Ext.util.Format.dateRenderer('M j, Y')},
	//	    {id: 'submisionStatus', header: 'Status', sortable: true, dataIndex: 'submissionStatus'}		
	//	],
	//	view: new Ext.grid.GroupingView({
	//		forceFit: true,
	//		groupTextTpl: '{[ values.rs[0].data["deliverableYear"] ]} {text} ({[ values.rs[0].data["deliverableCategory"] ]})',
	//		hideGroupedColumn: true,
	//		enableNoGroups: false,
	//		enableGroupingMenu: false,
	//	}),
	//	plugins: expander
	//});
	
	//return grid;
}

function makeOnlineGridPanel() {
	// Create a reader
	var reader = new Ext.data.JsonReader({
		root: 'rows',
		totalProperty: 'results',
		fields: [
		    {name: 'urlType'},     
		    {name: 'url'},
		    {name: 'submissionName'},
		    {name: 'deliverables'},
		    {name: 'label'}
		]
	});
	
	// Create the grouping data store
	//  store.on defines a function to call when loading is complete
	var store = new Ext.data.GroupingStore({
		reader: reader,
		url: theOnlineUrl, //defined in state-report.html template
		groupField: 'urlType'
	});
	
	// Load the store 
	store.load();
	
	// Make the Data Grid
	var grid = new Ext.grid.GridPanel({
		store: store,
		hideHeaders: true,
		frame: true,
		title: onlineTitle, // onlineTitle defined in state-report.html template
		region: 'center',
		margins: '0 0 5 0',
		columns: [
		    {id: 'urlType', header: 'Type', dataIndex: 'urlType', hidden: true},
		    {
		    	id: 'submissionName',
		    	header: 'File Name',
		    	sortable: true,
		    	dataIndex: 'submissionName',
		    	xtype: 'templatecolumn',
		    	tpl: '{label}'
		    }
		],
		view: new Ext.grid.GroupingView({
			forceFit: true,
			groupTextTpl: '{[ values.rs[0].data["urlType"] ]}'
		})
	});
	
	return grid;
}

function makeMapPanel() {
	OpenLayers.ProxyHost = '/track/proxy?url=';
	
	thisMap = new OpenLayers.Map('ThisState', buildMapOptions());
	thisMap.addLayer(wmsBackgroundLayer("BackgroundLayer"));
	
	//State Boundaries, transparent interior
	thisMap.addLayer(wfsStateLayer("StateBoundaries", null, true));
	
	// Override the BBOX strategy with a filter, setup and event listener to zoom to one state
	var wfsLayer = wfsStateLayer("StateLayer", stateStrategy); // stateStrategy defined in state-report.html template
	wfsLayer.events.register('featureadded', this, function() {
		stateExtent = wfsLayer.features[0].geometry.getBounds();
		thisMap.zoomToExtent(stateExtent);
		
		otherMap.panTo(thisMap.getCenter());
	});
	thisMap.addLayer(wfsLayer);
	
	mainMap = new GeoExt.MapPanel({
        map: thisMap,
        height: 325,
        x: 0,
        y: 0,
        bodyStyle: 'border: none;'
    });
	
	// Build the overlay map with the state's flower on it
	otherMap = new OpenLayers.Map('Flower', buildMapOptions(resolution)); // resolution is defined in state-report.html template
	
	// It looks like OpenLayers requires a background Layer...
	backdrop = wmsBackgroundLayer("BackgroundLayer");
	backdrop.setOpacity(0);
	otherMap.addLayer(backdrop);
	
	// Create the Flower
	otherMap.addLayer(wfsPointLayer("overlayPointLayer", pointStrategy)); // pointStrategy is defined in state-report.html template
	
	var centerPointLayer = wfsCenterPointLayer("CenterPointLayer", centerStrategy, true, '${state}'); // centerStrategy is defined in state-report.html template
	centerPointLayer.events.register('featuresadded', this, function() {
		point = centerPointLayer.features[0].geometry.getCentroid();
		otherMap.panTo(new OpenLayers.LonLat(point.x, point.y));
	});
	otherMap.addLayer(centerPointLayer);
	
	// Add Pop-ups
	addClickEvent({ "overlay": otherMap });
	addHoverEvent({ "overlay": otherMap });
	
	overlayMap = new GeoExt.MapPanel({
		map: otherMap,
        height: 325,
        x: 0,
        y: 0,
        id: 'overlayMap',
        bodyStyle: 'background: none; border: none;'
	});
		
	// Build the panel that will live on the bottom of the right side
	return new Ext.Panel({
		title: 'Map View <a href="/track/map">(Click here for the nationwide map)</a>',
		region: 'south',
		margins: '0 0 0 0',
		height: 347,
		layout: 'absolute',
		items: [ mainMap, overlayMap ]
	});
}

Ext.onReady(function() {	
	// Make a side-panel
	var rightPanel = new Ext.Panel({
		region: 'east',
		width: 350,
		margins: '5 5 5 5',
		layout: 'border',
		items: [
            makeMapPanel(),
            makeOnlineGridPanel()
		],
		bodyStyle: 'background: none; border: none;'
	});
	
	// Make a Title/Header
	var topPanel = new Ext.BoxComponent({
		autoEl: {
			html: '<a href="http://stategeothermaldata.org"><img src="' + headImgUrl + '"></img></a>', //defined in state-report.html template
		},
		style: 'padding-top: 6px; padding-left: 25px;',
		region: 'north',
		margins: '5 5 0 5',
		height: 100
	});
	
	// Build the main panel with two Grids inside it
	var mainPanel = new Ext.Panel({
		layout: 'border',
		items: [
	        makeMainGridPanel(),
	        makeSummaryGridPanel()
		],
		region: 'center',
		bodyStyle: 'background: none; border: none;',
		margins: '5 0 5 5'
	});
	
	// Build the Viewport
	var vp = new Ext.Viewport({
		layout: 'border',
		renderTo: document.body,
		title: pageTitle,
		items: [ mainPanel, rightPanel, topPanel ],
		style: 'background: #17293D url(' + headerBackUrl + ');'
	})
    
});