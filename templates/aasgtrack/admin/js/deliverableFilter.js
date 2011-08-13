{% load filters %}
filterer = {};
{% for state in states %}
	filterer["{{ state.name }}"] = {{ filterer|get:state.name|safe }};
{% endfor %}

$(document).ready(function() {
	//deliverableSelect = $('#id_satisfies_deliverable_from');
	stateSelect = $('#id_state');
	//if (deliverableSelect.selectedIndex == 0) {
	//	deliverableSelect.empty();
	//}
	
	stateSelect.change(function() {
		$('#id_satisfies_deliverable_from').children().remove();
		stateName = this.children[this.selectedIndex].text
		for (deliverable in filterer[stateName]) {
			$('#id_satisfies_deliverable_from').append('<option value="' + deliverable + '">' + filterer[stateName][deliverable] + '</option>');
		}
	});
});

