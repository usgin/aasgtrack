var panelStyle = "font-size: 1.1em; padding: 5px; line-height: 125%;";
var tutorialToolbar = new Ext.Toolbar({
	buttonAlign: 'center',
	id: "map-info-toolbar",
	defaults: {
		cls: 'map-info-tool',
		bodyStyle: "font-size: 1.1em;"
	},
	items: [
        "Use this map to:", " ",
        { 
        	text: "Compare Progress Across All States", 
        	menu: { 
        		xtype: 'menu',
        		items: [
    		        {
    		        	xtype: 'panel',
    		        	html: "Data being provided by each state has been categorized into eight different themes, as indicated by the legend near the bottom of the map. Clicking on one of the colored dots on the legend will cause many of the states to become colored. The range of colors that appear indicate how far along each state is in the completion of their data deliverables in the theme that was selected. For a broad report summarizing the data collection across all eight themes and all 50 states, <strong><a href='http://services.usgin.org/track/report/' target='_blank'>click here</a></strong>." ,    		        	
    		        	cls: 'map-info-text',
    		        	bodyStyle: panelStyle
    		        }
		        ],
		        plain: true
        	}        	
        }, " ", "|", " ",
        { 
        	text: "View Datasets Anticipated and Available from a Specific State",
        	menu: {
        		xtype: 'menu',
        		items: [
    		        {
    		        	xtype: 'panel',
    		        	html: "Over each state, a colored dot indicates that the state intends to provide data falling under that particular theme, while a grey dot means no data in that theme is currently anticipated. By clicking one of the colored dots on a state, you can view the specific deliverables expected from that state in the selected theme, and the progress of those deliverables.",
    		        	cls: 'map-info-text',
    		        	bodyStyle: panelStyle
    		        }
		        ],
		        plain: true
        	}
		}, " ", "|", " ",
        { 
			text: "View Detailed Information About a Specific State's Datasets",
			menu: {
        		xtype: 'menu',
        		items: [
    		        {
    		        	xtype: 'panel',
    		        	html: "To see more detailed information about the deliverables from any one state, including links to data and web services available, follow the hyperlink that appears at the top of the state's popup box or use the drop-down menu below the map to view a detailed report.",
    		        	cls: 'map-info-text',
    		        	bodyStyle: panelStyle
    		        }
		        ],
		        plain: true
        	}
		}
    ]
});