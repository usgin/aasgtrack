var thisMap;
var otherMap;

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
		    {name: 'submissionComments'}
		]
	});
	
	// Create a #@$!!&^-ing template for the expander
	var thisTpl = new Ext.XTemplate('<p>Comments:</p>', '<tpl for="submissionComments">', '<p>{.}</p>', '</tpl>');
	
	// Create the rowExpander for comments
	var expander = new Ext.ux.grid.RowExpander({
		tpl: thisTpl
	});
	
	// Create the grouping data store
	//  store.on defines a function to call when loading is complete
	var store = new Ext.data.GroupingStore({
		reader: reader,
		url: theUrl, //defined in state-report.html template
		groupField: 'deliverableName'
	});
	
	// Load the store 
	store.load();
	
	// Make the Data Grid
	var grid = new Ext.grid.GridPanel({
		store: store,
		//frame: true,
		margins: '5 0 5 5',
		title: subTitle, // defined in state-report.html template
		region: 'center',
		columns: [
		    expander,
		    {id: 'deliverableName', header: 'Deliverable', sortable: true, dataIndex: 'deliverableName', hidden: true},
		    {id: 'submissionFile', header: 'Submitted File', sortable: true, dataIndex: 'submissionFile'},
		    {id: 'submissionSubDate', header: 'Submitted On', sortable: true, dataIndex: 'submissionSubDate', renderer: Ext.util.Format.dateRenderer('M j, Y')},
		    {id: 'submisionStatus', header: 'Status', sortable: true, dataIndex: 'submissionStatus'}		
		],
		view: new Ext.grid.GroupingView({
			forceFit: true,
			groupTextTpl: '{[ values.rs[0].data["deliverableYear"] ]} {text} ({[ values.rs[0].data["deliverableCategory"] ]})'
		}),
		plugins: expander
	});
	
	return grid;
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
		    {name: 'deliverables'}
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
		    	tpl: '<a href="{url}">{submissionName}</a>'
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
		
		//point = wfsLayer.features[0].geometry.getCentroid();
		//otherMap.panTo(new OpenLayers.LonLat(point.x, point.y));
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
		height: 325,
		layout: 'absolute',
		items: [ mainMap, overlayMap ]
	});
}

Ext.onReady(function() {	
	// Make a side-panel
	var rightPanel = new Ext.Panel({
		region: 'east',
		width: 350,
		collapseMode: 'mini',
		split: true,
		margins: '5 5 5 0',
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
	
	// Build the Viewport
	var vp = new Ext.Viewport({
		layout: 'border',
		renderTo: document.body,
		title: pageTitle,
		items: [ makeMainGridPanel(), rightPanel, topPanel ],
		style: 'background: #17293D url(' + headerBackUrl + ');'
	})
    
});