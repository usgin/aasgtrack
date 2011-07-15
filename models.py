from django.contrib.gis.db import models
from django.contrib.auth.models import User

# Categories for deliverables as defined in Janel's maps
DELIVERABLE_CATEGORIES = (('temp','Temperature & Heatflow'), 
                          ('wchem', 'Water Chemistry'),
                          ('tect', 'Recent Tectonics'),
                          ('other', 'Other'),
                          ('meta', 'Metadata and Documents'),
                          ('map', 'Map Data'),
                          ('well', 'Well Logs'),
                          ('rchem', 'Rock Chemistry'))

CATEGORIES = dict()
for item in DELIVERABLE_CATEGORIES:
    CATEGORIES[item[0]] = item[1]

SUBMISSION_STATUS = (('submitted', 'Submitted'),
                     ('review', 'In Review'),
                     ('returned', 'Returned'),
                     ('approved', 'Approved'),
                     ('online', 'Online'))

STATUS = dict()
for item in SUBMISSION_STATUS:
    STATUS[item[0]] = item[1]
    
YEARS = ((1, 'Year One'),
         (2, 'Year Two'),
         (3, 'Year Three'))
    
def completion_calc(state, category):
    categorized_deliverables = None;
    if category in ['all']:
        categorized_deliverables = state.deliverable_set.all()
    elif category not in CATEGORIES: 
        return None
    else:
        categorized_deliverables = state.deliverable_set.filter(category=category)
        
    deliverable_count = len(categorized_deliverables)
    if deliverable_count == 0: return None
    
    online_deliverables = categorized_deliverables.filter(submission__status__in=['online', 'approved']).distinct()
    satisfied_deliverables = len(online_deliverables)
    
    if satisfied_deliverables > deliverable_count:
        return 100
    else:
        return ( float(satisfied_deliverables) / deliverable_count ) * 100
    
class State(models.Model):
    # One for each state. Just for geometries and categorization really.
    class Meta:
        ordering = ['name']
        
    abbreviation = models.CharField(max_length=2)
    name = models.CharField(max_length=50)
    shape = models.MultiPolygonField(srid=3857)
    objects = models.GeoManager()
    
    def __unicode__(self):
        return self.name
    
    def submissions_in_review(self):
        return len(self.deliverable_set.filter(submission__status='submitted')) + len(self.deliverable_set.filter(submission__status='review'))
    
    def category_completion(self, category):
        return completion_calc(self, category)
        
    def temp_completion(self):
        return completion_calc(self, 'temp')
    temp_completion.short_description = CATEGORIES['temp']
    
    def wchem_completion(self):
        return completion_calc(self, 'wchem')
    wchem_completion.short_description = CATEGORIES['wchem']
    
    def tect_completion(self):
        return completion_calc(self, 'tect')
    tect_completion.short_description = CATEGORIES['tect']
    
    def other_completion(self):
        return completion_calc(self, 'other')
    other_completion.short_description = CATEGORIES['other']
    
    def meta_completion(self):
        return completion_calc(self, 'meta')
    meta_completion.short_description = CATEGORIES['meta']
    
    def map_completion(self):
        return completion_calc(self, 'map')
    map_completion.short_description = CATEGORIES['map']
    
    def well_completion(self):
        return completion_calc(self, 'well')
    well_completion.short_description = CATEGORIES['well']
    
    def rchem_completion(self):
        return completion_calc(self, 'rchem')
    rchem_completion.short_description = CATEGORIES['rchem']    

class Deliverable(models.Model):
    # Deliverables defined in a state's statement-of-work
    class Meta:
        ordering = ['data_item']
    
    state = models.ForeignKey('State')
    year = models.IntegerField(choices=YEARS)    
    data_item = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=DELIVERABLE_CATEGORIES)
    definition = models.TextField(blank=True)
    amount_of_data = models.TextField(blank=True, null=True)
    attributes = models.TextField(max_length=2000, blank=True)
    delivery_plan = models.TextField()
    objects = models.GeoManager()
    
    def __unicode__(self):
        return self.state.abbreviation + ': ' + self.data_item
    
    def is_satisfied(self):
        if len(self.submission_set.filter(status__in=['approved', 'online'])) > 0:
            return True
        else:
            return False

class Submission(models.Model):
    # Something a state has delivered in order to satisfy a deliverable
    class Meta:
        ordering = ['-date_submitted']
        
    state = models.ForeignKey('State')
    status = models.CharField(max_length=50, choices=SUBMISSION_STATUS)
    date_submitted = models.DateField()
    status_date = models.DateField()
    file_name = models.CharField(max_length=255)
    satisfies_deliverable = models.ManyToManyField('Deliverable', verbose_name='Deliverables')
    objects = models.GeoManager()
    
    def __unicode__(self):
        return self.state.abbreviation + ': ' + self.file_name

class SubmissionComment(models.Model):
    # Comments about a particular submission
    class Meta:
        ordering = ['date']
    
    comment = models.TextField()
    date = models.DateField()
    user = models.ForeignKey(User)
    submission = models.ForeignKey('Submission')
    objects = models.GeoManager()
    
    def __unicode__(self):
        return str(self.date) + ' -- ' + self.submission.__unicode__()


