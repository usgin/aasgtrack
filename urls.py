from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('aasgtrack.views',
    url(r'^(?P<state>[a-zA-Z]{2})/(?P<category>[a-zA-Z]+)?/?(?P<context>[a-zA-Z]+)?', 'state_progress'),
    url(r'^map/?$', 'progress_map'),
    url(r'^(?P<category>[a-zA-Z]+)/sld/?$', 'category_sld'),
    url(r'^update/(?P<state>[a-zA-Z]{2})?/?$', 'update_state_completion'),
    url(r'^map/js/(?P<js_file_name>.+\.js)$', 'map_scripts'),
    url(r'^proxy.*$', 'service_proxy'),
)