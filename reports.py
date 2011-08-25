from models import State, Deliverable, Submission, SubmissionComment, CATEGORIES, HOSTS, STATUS, PROJECT_YEARS, completed_deliverables, get_completion_percent
from views import standard_context
from django.shortcuts import get_object_or_404, get_list_or_404, render_to_response
from django.http import HttpResponse, HttpResponseNotAllowed, Http404
import json

def all_data(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Check that the requested state is valid
    state_abbr = request.GET.get('state', 'none')
    if state_abbr == 'none':
        states = State.objects.exclude(abbreviation='DC')
    else:
        states = get_list_or_404(State, abbreviation__iexact=state_abbr)
    
    # Generate a list of records for the GridPanel
    records = []
    grandTotalRecords = 0
    grandTotalDeliverables = 0
    
    for this_state in states:
        totalRecords = 0
        completedDeliverables = 0
        for category in CATEGORIES:
            these_deliverables = Deliverable.objects.filter(state=this_state).filter(category=category)
            if len(these_deliverables) == 0: continue
            
            these_submissions = Submission.objects.filter(satisfies_deliverable__in=these_deliverables)
            
            record = { 'state': this_state.abbreviation, 'state_name': this_state.name, 'category': CATEGORIES.get(category) }
            record['deliverableCount'] = len(these_deliverables)
            
            satisfied, total = completed_deliverables(this_state, category)
            record['deliverablesComplete'] = satisfied
            completedDeliverables = completedDeliverables + satisfied
            grandTotalDeliverables = grandTotalDeliverables + satisfied
            
            record['completion'] = get_completion_percent(satisfied, total)
            if these_submissions:
                record['recentSubmission'] = these_submissions[0].date_submitted.isoformat()
            else:
                record['recentSubmission'] = 'None'
                
            # Count the number of records available online
            recordCount = 0
            for online_submission in these_submissions.filter(status__in=['online']):
                if online_submission.number_of_records:
                    recordCount = recordCount + online_submission.number_of_records
                    totalRecords = totalRecords + recordCount
                    grandTotalRecords = grandTotalRecords + recordCount
                    
            record['onlineCount'] = recordCount
            
            # Add the group-label
            record['groupLabel'] = '<a href="/track/report/' + this_state.abbreviation + '">State: ' + this_state.name + '</a>'
            records.append(record)
            
        # Create a "summary" record for this state
        record = { 'state': this_state.abbreviation, 'state_name': this_state.name, 'category': 'Totals for ' + this_state.name }
        record['deliverableCount'] = len(this_state.deliverable_set.all())
        record['deliverablesComplete'] = completedDeliverables
        record['completion'] = ( float(completedDeliverables) / len(this_state.deliverable_set.all()) ) * 100
        record['onlineCount'] = totalRecords
        record['summary'] = True
        
        records.append(record)
        
    # Create a system-wide summary record if we were asked for all the data
    if len(states) != 1:
        record = { 'state': 'AA', 'state_name': ' System-Wide', 'category': 'All States, All Cateogries' }
        record['deliverableCount'] = len(Deliverable.objects.all())
        record['deliverablesComplete'] = grandTotalDeliverables
        record['completion'] = ( float(grandTotalDeliverables) / len(Deliverable.objects.all()) ) * 100
        record['onlineCount'] = grandTotalRecords
        record['groupLabel'] = 'State-Wide System Totals'
        record['summary'] = True
        
        records.insert(0, record)
    
    # Build the JSON object
    response = { 'results': len(records), 'rows': records }
    return HttpResponse(json.dumps(response), mimetype="application/json")

def online_state_data(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META.get('REQUEST_METHOD') not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Check that the requested state is valid
    if not request.GET: raise Http404('Please provide an appropriate "state" parameter. For example, track/report/data?state=al.')
    state_abbr = request.GET.get('state', 'none')
    state = get_object_or_404(State, abbreviation__iexact=state_abbr)
        
    # Build a list of records for the GridPanel
    records = []
    downloads = 0
    services = 0
    
    for submission in state.submission_set.filter(status='online'):
        # Grab some information about the deliverables that the submission satisfies
        deliverables = []
        for deliverable in submission.satisfies_deliverable.all():
            deliverables.append({'year': PROJECT_YEARS.get(deliverable.year), 'name': deliverable.data_item, 'category': CATEGORIES.get(deliverable.category)})
        
        # Add a record for a service (if present)
        if submission.service_url:
            record = {'submissionName': submission.file_name }
            record['urlType'] = 'Services'
            record['url'] = submission.service_url        
            record['label'] = '<a href="' + submission.service_url + '">' + submission.title + '</a>'
    
            record['deliverables'] = deliverables
            
            # Append the record
            records.append(record)
            services = services + 1
        
        # Add a record for a download (if present)
        if submission.download_url:
            record = {'submissionName': submission.file_name }
            record['urlType'] = 'Downloads'
            record['url'] = submission.download_url
            record['label'] = '<a href="' + submission.download_url + '">' + submission.title + '</a>'
            
            record['deliverables'] = deliverables
            
            # Append the record
            records.append(record)
            downloads = downloads + 1        
    
    # Generate dummy records if there is nothing to show
    if services == 0:
        record = {'label': 'No services online', 'urlType': 'Services', }
        records.append(record)
    if downloads == 0:
        record = {'label': 'No downloads available', 'urlType': 'Downloads'}
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
    
     # Check if a year was specified
    year = request.GET.get('year')
    if year: year = int(year)
    
    # Build a list of records for the GridPanel
    deliverables_with_submissions = []
    records = []
    for submission in state.submission_set.all():
        for deliverable in submission.satisfies_deliverable.all():
            # Skip this deliverable if it is not of the specified year
            if year and deliverable.year != year:
                continue
            
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
            record['submissionStatus'] = '<span class="submission-status">' + STATUS.get(submission.status) + '</span> as of ' + submission.status_date.strftime('%b %d, %Y')
            record['submissionStatDate'] = submission.status_date.isoformat()
            record['submissionSubDate'] = submission.date_submitted.isoformat()
            record['submissionTitle'] = submission.title
            
            # Add information to the record about comments on the submission
            record['submissionComments'] = []
            for comment in submission.submissioncomment_set.all():
                record['submissionComments'].append(comment.date.strftime('%b %d, %Y') + ': ' + comment.comment)
            
            # Add the record to the set of records to be JSON-ificated     
            records.append(record)
            
    # Should check that all deliverables are represented. Add a blank row for deliverables with no submissions.
    for deliverable in state.deliverable_set.all():
        if deliverable not in deliverables_with_submissions:
            # Again, skip if it isn't from the specified year
            if year and deliverable.year != year:
                continue
            
            record = { 'state': state.abbreviation }
            record['deliverableId'] =  deliverable.pk
            record['deliverableYear'] = PROJECT_YEARS.get(deliverable.year)
            record['deliverableName'] = deliverable.data_item
            record['deliverableDef'] = deliverable.definition
            record['deliverablePlan'] = deliverable.delivery_plan
            record['deliverableCategory'] = CATEGORIES.get(deliverable.category)
            
            record['submissionTitle'] = 'No submissions yet...'
            record['noExpansion'] = True
            
            records.append(record)
    
    # Generate dummy records if there is nothing to show
    if len(records) == 0:
        record = { 'state': state.abbreviation }
        record['deliverableName'] = 'No contracted deliverables yet...'
        record['noExpansion'] = True
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