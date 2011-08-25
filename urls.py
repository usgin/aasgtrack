from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('aasgtrack.views',
    url(r'^(?P<state>[a-zA-Z]{2})/(?P<context>[a-zA-Z]+)/?(?P<category>[a-zA-Z]+)?/?', 'state_progress'),
    url(r'^map/?$', 'progress_map'),
    url(r'^map/js/(?P<js_file_name>.+\.js)$', 'map_scripts'),
    url(r'^admin/js/(?P<js_file_name>.+\.js)$', 'admin_scripts'),
    url(r'^proxy.*$', 'service_proxy'),
    url(r'^tempo$', 'tempo')
)

urlpatterns += patterns('aasgtrack.reports',
    url(r'^report/all-data', 'all_data'),
    url(r'^report/data/online', 'online_state_data'),
    url(r'^report/data', 'state_data'),
    url(r'^report/?$', 'full_report'),
    url(r'^report/(?P<state>[a-zA-Z]{2})/?$', 'state_report')             
)