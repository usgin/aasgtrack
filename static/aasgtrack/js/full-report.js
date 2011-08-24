Ext.onReady(function() {
	// Create a data reader
	var reader = new Ext.data.JsonReader({
		root: 'rows',
		totalProperty: 'results',
		fields: [
		    {name: 'state'},
		    {name: 'state_name'},
		    {name: 'category'},
		    {name: 'deliverableCount'},
		    {name: 'deliverablesComplete'},
		    {name: 'completion'},
		    {name: 'recentSubmission', type: 'date', dateFormat: 'Y-m-d'},
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
				Ext.MessageBox.hide();gridpanel
			}
	};
	
    // Create the grouping data store
	//  store.on defines a function to call when loading is complete
	var store = new Ext.data.GroupingStore({
		reader: reader,
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
		columns: [
		    {id: 'state_name', header: 'State', sortable: true, dataIndex: 'state_name', hidden: true},
		    {id: 'category', header: 'Content Category', sortable: true, dataIndex: 'category'},
		    {id: 'deliverableCount', header: 'Number of Deliverables Expected', sortable: true, dataIndex: 'deliverableCount'},
		    {id: 'deliverablesComplete', header: 'Number of Completed Deliverables', sortable: true, dataIndex: 'deliverablesComplete'},
		    {id: 'completion', header: 'Percent Complete', sortable: true, dataIndex: 'completion', renderer: function(value) { response = Ext.util.Format.round(value, 2) + '%'; return response;} },
		    {id: 'onlineCount', header: 'Number of Records Online', sortable: true, dataIndex: 'onlineCount'},
		    {id: 'recentSubmission', header: 'Date of Most Recent Submission', sortable: true, dataIndex: 'recentSubmission', renderer: Ext.util.Format.dateRenderer('M j, Y')}
		],
		margins: '5 5 5 5',
		view: new Ext.grid.GroupingView({
			forceFit: true,
			groupTextTpl: '<a href="/track/report/{[ values.rs[0].data["state"] ]}">{text}</a>'
		})
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