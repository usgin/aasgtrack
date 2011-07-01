SELECT 
  aasgtrack_state.id, 
  aasgtrack_state.abbreviation, 
  aasgtrack_state."name", 
  aasgtrack_statecompletion."temp", 
  aasgtrack_statecompletion.wchem, 
  aasgtrack_statecompletion.tect, 
  aasgtrack_statecompletion.other, 
  aasgtrack_statecompletion.meta, 
  aasgtrack_statecompletion.map, 
  aasgtrack_statecompletion.lith, 
  aasgtrack_statecompletion.rchem, 
  aasgtrack_state.shape
FROM 
  public.aasgtrack_state, 
  public.aasgtrack_statecompletion
WHERE 
  aasgtrack_statecompletion.state_id = aasgtrack_state.id;
