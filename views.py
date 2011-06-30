from django.http import HttpResponse, HttpResponseNotAllowed, Http404
from django.shortcuts import render_to_response, get_object_or_404
from django.conf import settings
from models import State, Deliverable, Submission, SubmissionComment, CATEGORIES, STATUS
from colorsys import hsv_to_rgb

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
    
def progress_map(request):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META['REQUEST_METHOD'] not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    return render_to_response('aasgtrack/map-base.html', standard_context({}))

def rgb_to_hex(r,g,b):
    hexchars = "0123456789ABCDEF"
    return "#" + hexchars[r / 16] + hexchars[r % 16] + hexchars[g / 16] + hexchars[g % 16] + hexchars[b / 16] + hexchars[b % 16]

def category_sld(request, category):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META['REQUEST_METHOD'] not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    # Make sure the category requested is correct
    if category not in CATEGORIES: raise Http404
    
    # All we need is a dictionary: lookup category, get list of HEX colors
    root_colors = {'temp': 0, 
                   'wchem': float(45) / 360,
                   'tect': float(90) / 360,
                   'other': float(135) / 360,
                   'meta': float(180) / 360,
                   'map': float(225) / 360,
                   'lith': float(270) / 360,
                   'rchem': float(315) / 360}
    
    # Build HSV color ramp
    hsv_color_ramp = []
    for index in [0, 1, 2, 3, 4]:
        hsv_color_ramp.append( ( root_colors[category], 1 - .18 * index, 1 ) )
    
    # Convert to RGB color ramp
    rgb_color_ramp = []
    for index in [0, 1, 2, 3, 4]:
        hsv_color = hsv_color_ramp[index]
        rgb_color_ramp.append( hsv_to_rgb( hsv_color[0], hsv_color[1], hsv_color[2] ) )
    
    # Convert to HEX color ramp
    hex_color_ramp = []
    for index in [0, 1, 2, 3, 4]:
        rgb_color = rgb_color_ramp[index]
        hex_color_ramp.append( rgb_to_hex( int(round(255*rgb_color[0])), int(round(255*rgb_color[1])), int(round(255*rgb_color[2])) ) )
        
    return render_to_response('aasgtrack/category-style.sld', standard_context({ 'category': category, 'colors': hex_color_ramp }), mimetype="application/xml")
    