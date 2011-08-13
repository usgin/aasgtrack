Ext.onReady(function() {
	// Create a data reader
	var reader = new Ext.data.JsonReader({
		root: 'rows',
		totalProperty: 'results',
		fields: [
		    {name: 'state'},     
		    {name: 'category'},
		    {name: 'deliverableCount'},
		    {name: 'completion'},
		    {name: 'recentSubmission', type: 'date'},
		    {name: 'onlineCount'}
		]
	});
	
	// Create a loading message
	var loadMsg = {
			'showLoading': function() {
				Ext.MessageBox.show({
					msg: 'Loading...',
					width: 300,
					wait: true,
					waitConfig: { interval: 400 }
				});					
			},
			'hideLoading': function() {
				Ext.MessageBox.hide();
			}
	};
	
    // Create the grouping data store
	//  store.on defines a function to call when loading is complete
	var store = new Ext.data.GroupingStore({
		reader: reader,
		url: 'data',
		groupField: 'state',			
	});	
	store.on({
		'load': {
				fn: function() {
					loadMsg.hideLoading();
				},
				scope: this
			}
	});
	
	// Load the store
	loadMsg.showLoading();
	store.load();
	
	// Make the Data Grid
	var grid = new Ext.grid.GridPanel({
		store: store,
		frame: true,
		title: 'AASG Geothermal Data System Report',
		region: 'center',
		columns: [
		    {id: 'state', header: 'State', sortable: true, dataIndex: 'state', hidden: true},
		    {id: 'category', header: 'Content Category', sortable: true, dataIndex: 'category'},
		    {id: 'deliverableCount', header: 'Number of Deliverables Expected', sortable: true, dataIndex: 'deliverableCount'},
		    {id: 'completion', header: 'Percent Complete in this Category', sortable: true, dataIndex: 'completion', renderer: function(value) { response = Ext.util.Format.round(value, 2) + '%'; return response;} },
		    {id: 'recentSubmission', header: 'Date of Most Recent Submission', sortable: true, dataIndex: 'recentSubmission', renderer: Ext.util.Format.dateRenderer('M j, Y')},
		    {id: 'onlineCount', header: 'Number of Datasets Online', sortable: true, dataIndex: 'onlineCount'},
		],
		view: new Ext.grid.GroupingView({
			forceFit: true,
			groupTextTpl: '{text}'
		})
	});
	
	// Fill the View with the Data Grid
	var vp = new Ext.Viewport({
		layout: 'border',
		renderTo: document.body,
		items: [ grid ]
	})
    
});