Ext.onReady(function() {
	// Create a data reader
	var reader = new Ext.data.ArrayReader({},
		[
		    {name: 'state'},     
		    {name: 'category'},
		    {name: 'deliverableCount'},
		    {name: 'completion'},
		    {name: 'recentSubmission'},
		    {name: 'onlineCount'}
		]);
	
	// Define the dataset
	var theData = [
    {% for record in records %}
    ['{{ record.state }}','{{ record.category }}','{{ record.deliverableCount }}','{{ record.completion }}','{{ record.recentSubmission }}','{{ record.onlineCount }}'],
    {% endfor %}
    ];
	
    // Create the grouping data store
	var store = new Ext.data.GroupingStore({
		reader: reader,
		data: theData,
		groupField: 'state'
	});
	
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
		    {id: 'completion', header: 'Percent Complete in this Category', sortable: true, dataIndex: 'completion'},
		    {id: 'recentSubmission', header: 'Date of Most Recent Submission', sortable: true, dataIndex: 'recentSubmission'},
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