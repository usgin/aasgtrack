// Create a data reader
var metricsReader = new Ext.data.JsonReader({
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
	    {name: 'onlineCount'},
	    {name: 'groupLabel'}
	]
});

var metricsColumns = [
    {id: 'state_name', header: 'State', sortable: true, dataIndex: 'state_name', hidden: true},
    {id: 'category', header: 'Content Category', sortable: true, dataIndex: 'category'},
    {id: 'deliverableCount', header: 'Number of Deliverables Expected', sortable: true, dataIndex: 'deliverableCount'},
    {id: 'deliverablesComplete', header: 'Number of Completed Deliverables', sortable: true, dataIndex: 'deliverablesComplete'},
    {id: 'completion', header: 'Percent Complete', sortable: true, dataIndex: 'completion', renderer: function(value) { response = Ext.util.Format.round(value, 2) + '%'; return response;} },
    {id: 'onlineCount', header: 'Number of Records Online', sortable: true, dataIndex: 'onlineCount'},
    {id: 'recentSubmission', header: 'Date of Most Recent Submission', sortable: true, dataIndex: 'recentSubmission', renderer: Ext.util.Format.dateRenderer('M j, Y')}
];

var metricsGroupView = new Ext.grid.GroupingView({
	forceFit: true,
	groupTextTpl: '{[ values.rs[0].data["groupLabel"] ]}',
	hideGroupedColumn: true,
	enableNoGroups: false,
	enableGroupingMenu: false
});