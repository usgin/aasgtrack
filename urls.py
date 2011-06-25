from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('aasgtrack.views',
    url('(?P<state>..)/(?P<category>.+)?/?(?P<context>.+)?', 'state_progress'),
)