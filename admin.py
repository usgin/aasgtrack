from django.contrib.gis import admin
from models import State, Deliverable, Submission, SubmissionComment

class CommentInline(admin.TabularInline):
    model = SubmissionComment
    extra = 0
    
class DeliverableInline(admin.StackedInline):
    model = Deliverable
    extra = 0
    
class StateAdmin(admin.GeoModelAdmin):
    exclude = ['shape']
    inlines = [DeliverableInline]
    
class SubmissionAdmin(admin.GeoModelAdmin):
    inlines = [CommentInline]
    
    

admin.site.register(State, StateAdmin)
admin.site.register(Submission, SubmissionAdmin)