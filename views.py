from django.http import HttpResponse, HttpResponseNotAllowed, Http404
from django.shortcuts import render_to_response, get_object_or_404
from django.conf import settings
from models import State, Deliverable, Submission, SubmissionComment, CATEGORIES, STATUS

VALID_CONTEXTS = ['full', 'popup']
    
def standard_context(additionals):
    context = {'media_url': settings.MEDIA_URL,
               'status_codes': STATUS,
               'category_codes': CATEGORIES,
               'states': State.objects.all(),}
    
    for item in additionals:
        context[item] = additionals[item]

    return context

def state_progress(request, state, category, context):
    # If no context is specified, "full" is the default
    if context is None: context = 'full'
    
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META['REQUEST_METHOD'] not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Check that the URL components were valid. If they aren't, 404
    if context not in VALID_CONTEXTS: raise Http404
    if category is not None and category not in CATEGORIES: raise Http404
    state = get_object_or_404(State, abbreviation__iexact=state)
    
    if category != None:
        # Get deliverables that fall under this category
        deliverables = state.deliverable_set.filter(category=category)
    else:
        # Get all this state's deliverables
        deliverables = state.deliverable_set.all()
    
    # Get submissions that address these deliverables
    submissions = Submission.objects.filter(satisfies_deliverable__in=deliverables)
    
    # Get comments that pertain to these submissions
    comments = SubmissionComment.objects.filter(submission__in=submissions)
    
    # Build context for the templates
    additional_context = {'comments': comments,
                          'submissions': submissions, 
                          'deliverables': deliverables,
                          'state': state}
    if category != None: additional_context['category'] = CATEGORIES[category]
    template_context = standard_context(additional_context)
    
    # Render the appropriate template
    if context == 'full':
        return render_to_response('aasgtrack/progress-full.html', template_context)
    if context == 'popup':
        return render_to_response('aasgtrack/progress-popup.html', template_context)
    else:
        # If this happens, double-check this code. Make sure there's an if-statement for each
        #  item in the VALID_CONTEXTS variable. You can only get here if that is botched.
        return HttpResponse('Sorry, there was an error', status=500)
    
    
    