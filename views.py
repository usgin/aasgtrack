from django.http import HttpResponse, HttpResponseNotAllowed, Http404
from django.shortcuts import render_to_response, get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from models import State, Deliverable, Submission, SubmissionComment, CATEGORIES, STATUS
from colorsys import hsv_to_rgb
import urllib2, json

VALID_CONTEXTS = ['full', 'popup']
HEX_COLOR_RAMPS = {'map': ['#0040FF', '#2E62FF', '#5C85FF', '#8AA7FF', '#B8C9FF'], 'temp': ['#FF0000', '#FF2E2E', '#FF5C5C', '#FF8A8A', '#FFB8B8'], 'tect': ['#80FF00', '#96FF2E', '#ADFF5C', '#C4FF8A', '#DBFFB8'], 'wchem': ['#FFBF00', '#FFCB2E', '#FFD65C', '#FFE28A', '#FFEDB8'], 'well': ['#8000FF', '#962EFF', '#AD5CFF', '#C48AFF', '#DBB8FF'], 'rchem': ['#FF00BF', '#FF2ECB', '#FF5CD6', '#FF8AE2', '#FFB8ED'], 'other': ['#00FF40', '#2EFF62', '#5CFF85', '#8AFFA7', '#B8FFC9'], 'meta': ['#00FFFF', '#2EFFFF', '#5CFFFF', '#8AFFFF', '#B8FFFF']}
ROOT_HEX_COLORS = {'map': '#0040FF', 'temp': '#FF0000', 'tect': '#80FF00', 'wchem': '#FFBF00', 'well': '#8000FF', 'rchem': '#FF00BF', 'other': '#00FF40', 'meta': '#00FFFF'}
    
def standard_context(additionals):
    context = {'media_url': settings.MEDIA_URL,
               'status_codes': STATUS,
               'category_codes': CATEGORIES,
               'states': State.objects.all(),
               'static_url': settings.STATIC_URL,}
    
    for item in additionals:
        context[item] = additionals[item]

    return context

def state_progress(request, state, context, category):
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
    
    # Get the completion percentage for this category
    if category == None:
        if state.category_completion('all') == None:
            percent = None
        else:
            percent = int(round(state.category_completion('all')))
    else:
        if state.category_completion(category) == None:
            percent = None
        else:
            percent = int(round(state.category_completion(category)))
        
    # Build context for the templates
    additional_context = {'comments': comments,
                          'submissions': submissions, 
                          'deliverables': deliverables,
                          'deliv_1': deliverables.filter(year=1),
                          'deliv_2': deliverables.filter(year=2),
                          'deliv_3': deliverables.filter(year=3),
                          'deliv_4': deliverables.filter(year=4),
                          'state': state,
                          'percent': percent}
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
    
    return render_to_response('aasgtrack/map/tracking-map.html', standard_context({}))
    
def build_color_scheme(category):
    scheme = {}
    #ramp = category_color_ramp(category)
    ramp = HEX_COLOR_RAMPS[category]
    
    # Loop through States
    for a_state in State.objects.exclude(abbreviation='DC'):
        # Get the state's completion percentage in this category
        complete = a_state.category_completion(category)
        
        # Determine which symbology bin it belongs in
        if 0 <= complete < 20:
            scheme[a_state.abbreviation] = {'fillColor': ramp[4]}
        elif 20 <= complete < 40:
            scheme[a_state.abbreviation] = {'fillColor': ramp[3]}
        elif 40 <= complete < 60:
            scheme[a_state.abbreviation] = {'fillColor': ramp[2]}
        elif 60 <= complete < 80:
            scheme[a_state.abbreviation] = {'fillColor': ramp[1]}
        elif 80 <= complete <= 100:
            scheme[a_state.abbreviation] = {'fillColor': ramp[0]}
        else:
            scheme[a_state.abbreviation] = {'fillColor': '#BFBFBF'}
    
    # Return the result
    return scheme
    
def map_scripts(request, js_file_name):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META['REQUEST_METHOD'] not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    
    additional_context = {}
    if js_file_name == 'map-styles.js':
        # Need to give scripts symbology context
        #  These context variables are dictionaries. Each one is named like a category, key is state abbreviation, value is hex color
        for cat in CATEGORIES:
            additional_context[cat] = build_color_scheme(cat)
        
        additional_context['colors'] = json.dumps(additional_context)
        
        # Add another context variable for the root colors
        additional_context['root_colors'] = ROOT_HEX_COLORS
        
    return render_to_response("aasgtrack/map/js/" + js_file_name, standard_context(additional_context), mimetype="text/javascript")

def admin_scripts(request, js_file_name):
    # Only GET commands are allowed
    valid_requests = ['GET']
    if request.META['REQUEST_METHOD'] not in valid_requests:
        return HttpResponseNotAllowed(valid_requests)
    the_dict = {}
    if js_file_name == 'deliverableFilter.js':
        for state in State.objects.exclude(abbreviation='DC'):
            deliverables = {}
            for deliverable in state.deliverable_set.all():
                deliverables[deliverable.pk] = str(deliverable.__unicode__())
            
            the_dict[state.name] = deliverables
            
    
    additional_context = {'filterer': the_dict}
    return render_to_response("aasgtrack/admin/js/" + js_file_name, standard_context(additional_context), mimetype="text/javascript")

def proxy_response_cors_headers(response, methods, headers, hosts=None):
    # Give a response CORS headers
    if hosts == None:
        response['Access-Control-Allow-Origin'] = '*'
    else:
        response['Access-Control-Allow-Origin'] = ','.join(hosts)
    response['Access-Control-Allow-Methods'] = ','.join(methods)
    response['Access-Control-Allow-Headers'] = ','.join(headers)
    
    return response

@csrf_exempt
def service_proxy(request):    
    # To get around XMLHTTPRequest cross-domain issues. Commonly used as OpenLayers.ProxyHost
    
    # These are the only domains that can be requested through this proxy
    allowedHosts = ['localhost', 'localhost:8080', 'localhost:8000',
                    'services.usgin.org', 'services.usgin.org:8080',
                    '50.19.88.63', '50.19.88.63:8080']
    
    # These are the only allowed request methods
    allowedRequests = ['POST', 'GET', 'OPTIONS']
    
    # These are the allowed CORS headers
    allowedHeaders = ['content-type', 'x-requested-with']
    
    # Check that the request Method is valid
    method = request.META['REQUEST_METHOD']
    if method in ["POST", "GET"]:
        # Find the URL that is being requested through this proxy
        url = request.GET.get('url', "http://www.openlayers.org")
    elif method in ["OPTIONS"]:
        # If it is an OPTIONS request, just respond appropriately
        response = HttpResponse("OK", status=200, mimetype="text/plain")
        return proxy_response_cors_headers(response, allowedRequests, allowedHeaders)
    else:
        return HttpResponseNotAllowed(allowedRequests)
    
    try:
        # Make sure the requested Host is allowed
        host = url.split("/")[2]
        if allowedHosts and not host in allowedHosts:
            return HttpResponse("502: Bad Gateway. Cannot provide " + url, status=502)
        
        elif url.startswith("http://") or url.startswith("https://"):            
            if method == "POST":
                headers = {'CONTENT-LENGTH': request.META['CONTENT_LENGTH'],
                           'CONTENT-TYPE': request.META.get('CONTENT_TYPE', 'text/plain')}
                body = request.raw_post_data
                r = urllib2.Request(url, body, headers)
                y = urllib2.urlopen(r)
            else:
                y = urllib2.urlopen(url)
            
            # print content type header
            response = HttpResponse(y.read())
            i = y.info()
            if i.has_key("Content-Type"):
                response['Content-Type'] = i["Content-Type"]
            else:
                response['Content-Type'] = "text/plain"
            
            y.close()
            
            return proxy_response_cors_headers(response, allowedRequests, allowedHeaders)
        else:
            return HttpResponse("Illegal request.")
    
    except Exception, E:
        return HttpResponse("Some unexpected error occurred. Error text was:" + E, status=500)
    
    
    