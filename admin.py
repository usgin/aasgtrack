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
    list_display = ['name',
                    'temp_completion', 
                    'wchem_completion',
                    'tect_completion',
                    'other_completion',
                    'meta_completion',
                    'map_completion',
                    'well_completion',
                    'rchem_completion',
                    'submissions_in_review']
    
    inlines = [DeliverableInline]
    
class SubmissionAdmin(admin.ModelAdmin):
    list_filter = ['state', 'status']
    list_display = ['__unicode__', 'date_submitted', 'status']
    filter_horizontal = ['satisfies_deliverable']
    
    inlines = [CommentInline]

class DeliverableAdmin(admin.ModelAdmin):
    list_display = ['data_item', 'is_satisfied']
    list_filter = ['state']
        
#admin.site.register(State, StateAdmin)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(Deliverable, DeliverableAdmin)