Ext.onReady(function() {
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
		reader: metricsReader, // defined in metrics-data.js
		url: 'all-data',
		groupField: 'state_name'
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
		title: 'AASG Geothermal Data System-Wide Report',
		region: 'center',
		columns: metricsColumns, // defined in metrics-data.js
		margins: '5 5 5 5',
		view: metricsGroupView, // defined in metrics-data.js
		enableColumnHide: false
	});
	
	// Make a Title/Header
	var topPanel = new Ext.BoxComponent({
		autoEl: {
			html: '<a href="http://stategeothermaldata.org"><img src="' + headImgUrl + '"></img></a>' //defined in state-report.html template
		},
		style: 'padding-top: 6px; padding-left: 25px;',
		region: 'north',
		margins: '5 5 0 5',
		height: 100
	});
	
	// Fill the View with the Data Grid
	var vp = new Ext.Viewport({
		layout: 'border',
		renderTo: document.body,
		items: [ 
		         grid,
		         topPanel
        ],
        style: 'background: #17293D url(' + headerBackUrl + ');'
	})
    
});