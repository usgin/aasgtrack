from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('aasgtrack.views',
    url(r'^(?P<state>[a-zA-Z]{2})/(?P<context>[a-zA-Z]+)/?(?P<category>[a-zA-Z]+)?/?', 'state_progress'),
    url(r'^map/?$', 'progress_map'),
    url(r'^map/js/(?P<js_file_name>.+\.js)$', 'map_scripts'),
    url(r'^admin/js/(?P<js_file_name>.+\.js)$', 'admin_scripts'),
    url(r'^proxy.*$', 'service_proxy')
)