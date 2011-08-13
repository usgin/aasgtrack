from models import State, Deliverable, Submission, SubmissionComment, CATEGORIES
from views import standard_context
from django.shortcuts import get_object_or_404, get_list_or_404, render_to_response
from django.http import HttpResponse, HttpResponseNotAllowed
import json

def data_dump(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Generate a list of records for the table
    records = []
    for this_state in State.objects.all():
        for category in CATEGORIES:
            these_deliverables = Deliverable.objects.filter(state=this_state).filter(category=category)
            if len(these_deliverables) == 0: continue
            
            these_submissions = Submission.objects.filter(satisfies_deliverable__in=these_deliverables)
            
            record = { 'state': this_state.abbreviation, 'category': CATEGORIES.get(category) }
            record['deliverableCount'] = len(these_deliverables)
            record['completion'] = this_state.category_completion(category)
            if these_submissions:
                record['recentSubmission'] = these_submissions[0].date_submitted.isoformat()#strftime('%B %d, %Y')
            else:
                record['recentSubmission'] = 'None'
            record['onlineCount'] = len(these_submissions.filter(status__in=['online', 'approved']))
            
            records.append(record)
            
    # Build the JSON object
    response = { 'results': len(records), 'rows': records }
    return HttpResponse(json.dumps(response), mimetype="application/json")
    
def full_report(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
  
    return render_to_response('aasgtrack/reports/progress-report.html', standard_context({}))
    