from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('aasgtrack.views',
    url('(?P<state>[a-zA-Z]{2})/(?P<category>[a-zA-Z]+)?/?(?P<context>[a-zA-Z]+)?', 'state_progress'),
)