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
	    {name: 'groupLabel'},
	    {name: 'summary'}
	]
});

var metricsColumns = [
    {id: 'state_name', header: 'State', dataIndex: 'state_name', hidden: true, menuDisabled: true},
    {id: 'category', header: 'Content Category', dataIndex: 'category', menuDisabled: true},
    {id: 'deliverableCount', header: 'Expected Deliverables', dataIndex: 'deliverableCount', menuDisabled: true},
    {id: 'deliverablesComplete', header: 'Completed Deliverables', dataIndex: 'deliverablesComplete', menuDisabled: true},
    {id: 'completion', header: 'Percent Complete', dataIndex: 'completion', renderer: function(value) { response = Ext.util.Format.round(value, 2) + '%'; return response;} , menuDisabled: true},
    {id: 'onlineCount', header: 'Records Online', dataIndex: 'onlineCount', menuDisabled: true},
    {id: 'recentSubmission', header: 'Most Recent Submission', dataIndex: 'recentSubmission', renderer: Ext.util.Format.dateRenderer('M j, Y'), menuDisabled: true}
];

var metricsGroupView = new Ext.grid.GroupingView({
	forceFit: true,
	groupTextTpl: '{[ values.rs[0].data["groupLabel"] ]}',
	hideGroupedColumn: true,
	enableNoGroups: false,
	enableGroupingMenu: false,
	getRowClass: function(record, index, rp, store) {
		if (record.data['summary']) {
			return 'summary-row';
		}
	}
});