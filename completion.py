from models import State, StateCompletion, CATEGORIES

def update_completion(state):
    # If no state is specified, update them all
    if state == None: 
        states = State.objects.all()
    else:
        states = [ state ]
    
    # Begin looping through the States that will be updated
    for a_state in states:
        # If there is no completion record for this state, create one
        if len(a_state.statecompletion_set.all()) == 0:
            completion_record = StateCompletion()
            completion_record.state = a_state
        else:
            # Otherwise get the existing one
            completion_record = a_state.statecompletion_set.all()[0]
            
        # Update the completion record
        completion_record.temp = a_state.temp_completion()
        completion_record.wchem = a_state.wchem_completion()
        completion_record.tect = a_state.tect_completion()
        completion_record.other = a_state.other_completion()
        completion_record.meta = a_state.meta_completion()
        completion_record.map = a_state.map_completion()
        completion_record.lith = a_state.lith_completion()
        completion_record.rchem = a_state.rchem_completion()
            
        # Save the record
        completion_record.save()
    