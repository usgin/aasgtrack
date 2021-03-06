from django.contrib.gis import admin
from models import State, Deliverable, Submission, SubmissionComment
from datetime import datetime

class CommentInline(admin.TabularInline):
    model = SubmissionComment
    extra = 0
    
class DeliverableInline(admin.StackedInline):
    model = Deliverable
    extra = 0
    
class StateAdmin(admin.GeoModelAdmin):
    exclude = ['shape']
    list_display = ['name',
                    'data_host']
    
    #inlines = [DeliverableInline]
    
class SubmissionAdmin(admin.ModelAdmin):
    class Media:
        js = (
            'http://code.jquery.com/jquery-1.4.4.min.js',
            '/track/admin/js/deliverableFilter.js',
        )
        
    list_filter = ['status', 'state']
    list_display = ['__unicode__', 'date_submitted', 'status', 'number_of_records']
    filter_horizontal = ['satisfies_deliverable']
    
    inlines = [CommentInline]
    
    def save_model(self, request, obj, form, change):
        if 'status' in form.changed_data:
            obj.status_date = datetime.today()
        
        obj.save()

class DeliverableAdmin(admin.ModelAdmin):
    list_display = ['__unicode__', 'category', 'is_satisfied']
    list_filter = ['category', 'state']
        
admin.site.register(State, StateAdmin)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(Deliverable, DeliverableAdmin)