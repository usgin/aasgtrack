from models import State, Deliverable, Submission, SubmissionComment, CATEGORIES, HOSTS, STATUS, PROJECT_YEARS
from views import standard_context
from django.shortcuts import get_object_or_404, get_list_or_404, render_to_response
from django.http import HttpResponse, HttpResponseNotAllowed, Http404
import json

def all_data(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Generate a list of records for the GridPanel
    records = []
    for this_state in State.objects.all():
        for category in CATEGORIES:
            these_deliverables = Deliverable.objects.filter(state=this_state).filter(category=category)
            if len(these_deliverables) == 0: continue
            
            these_submissions = Submission.objects.filter(satisfies_deliverable__in=these_deliverables)
            
            record = { 'state': this_state.abbreviation, 'state_name': this_state.name, 'category': CATEGORIES.get(category) }
            record['deliverableCount'] = len(these_deliverables)
            record['completion'] = this_state.category_completion(category)
            if these_submissions:
                record['recentSubmission'] = these_submissions[0].date_submitted.isoformat()
            else:
                record['recentSubmission'] = 'None'
            record['onlineCount'] = len(these_submissions.filter(status__in=['online', 'approved']))
            
            records.append(record)
            
    # Build the JSON object
    response = { 'results': len(records), 'rows': records }
    return HttpResponse(json.dumps(response), mimetype="application/json")
    
def state_data(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Check that the requested state is valid
    if not request.GET: raise Http404('Please provide an appropriate "state" parameter. For example, track/report/data?state=al.')
    state_abbr = request.GET.get('state', 'none')
    state = get_object_or_404(State, abbreviation__iexact=state_abbr)
    
    # Build a list of records for the GridPanel
    deliverables_with_submissions = []
    records = []
    for submission in state.submission_set.all():
        for deliverable in submission.satisfies_deliverable.all():
            if deliverable not in deliverables_with_submissions:
                deliverables_with_submissions.append(deliverable)
            
            # Add information to the record about the deliverable
            record = { 'state': state.abbreviation }
            record['deliverableId'] =  deliverable.pk
            record['deliverableYear'] = PROJECT_YEARS.get(deliverable.year)
            record['deliverableName'] = deliverable.data_item
            record['deliverableDef'] = deliverable.definition
            record['deliverablePlan'] = deliverable.delivery_plan
            record['deliverableCategory'] = CATEGORIES.get(deliverable.category)
            
            # Add information to the record about the submission
            record['submissionFile'] = submission.file_name
            record['submissionStatus'] = STATUS.get(submission.status) + ' as of ' + submission.status_date.strftime('%b %d, %Y')
            record['submissionStatDate'] = submission.status_date.isoformat()
            record['submissionSubDate'] = submission.date_submitted.isoformat()
            
            # Add information to the record about comments on the submission
            record['submissionComments'] = []
            for comment in submission.submissioncomment_set.all():
                record['submissionComments'].append(comment.date.strftime('%b %d, %Y') + ': ' + comment.comment)
            
            # Add the record to the set of records to be JSON-ificated     
            records.append(record)
            
    # Should check that all deliverables are represented. Add a blank row for deliverables with no submissions.
    for deliverable in state.deliverable_set.all():
        if deliverable not in deliverables_with_submissions:
            record = { 'state': state.abbreviation }
            record['deliverableId'] =  deliverable.pk
            record['deliverableYear'] = PROJECT_YEARS.get(deliverable.year)
            record['deliverableName'] = deliverable.data_item
            record['deliverableDef'] = deliverable.definition
            record['deliverablePlan'] = deliverable.delivery_plan
            record['deliverableCategory'] = CATEGORIES.get(deliverable.category)
            
            record['submissionFile'] = 'No submissions yet...'
            
            records.append(record)
            
    # Build the JSON object
    response = { 'results': len(records), 'rows': records }
    return HttpResponse(json.dumps(response), mimetype="application/json")

def full_report(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
  
    return render_to_response('aasgtrack/reports/full-report.html', standard_context({}))

def state_report(request, state):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
  
    # Check that the requested state is valid
    this_state = get_object_or_404(State, abbreviation__iexact=state)
    
    return render_to_response('aasgtrack/reports/state-report.html', standard_context({'state': this_state}))    