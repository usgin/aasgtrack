Ext.onReady(function() {
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
	
	// Create a motherfucking template for the expander
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
		title: 'Submission Information',
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
	
	// Make a side-panel
	var rightPanel = new Ext.Panel({
		region: 'east',
		width: 350,
		collapsible: true,
		split: true,
		margins: '5 5 5 0',
		layout: 'border',
		items: [
            {
            	title: 'Map of This State',
            	region: 'center',
            	margins: '5 5 5 5'
            },
            {
            	title: 'Online Stuff',
            	region: 'south',
            	height: 300,
            	margins: '0 5 5 5'
            }
		]
	});
	
	// Make a Title/Header
	var topPanel = new Ext.Panel({
		html: '<h1>' + pageTitle + '</h1>', //defined in state-report.html template
		region: 'north',
		margins: '5 5 0 5',
		height: 50
	});
	
	// Build the Viewport
	var vp = new Ext.Viewport({
		layout: 'border',
		renderTo: document.body,
		items: [ grid, rightPanel, topPanel ]
	})
    
});