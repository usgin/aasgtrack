from django.contrib.gis.db import models
from django.contrib.auth.models import User

# Categories for deliverables as defined in Janel's maps
DELIVERABLE_CATEGORIES = (('temp','Temperature & Heatflow'), 
                          ('wchem', 'Water Chemistry'),
                          ('tect', 'Recent Tectonics'),
                          ('other', 'Other'),
                          ('meta', 'Metadata and Documents'),
                          ('map', 'Map Data'),
                          ('lith', 'Lithology Logs'),
                          ('rchem', 'Rock Chemistry'))

class State(models.Model):
    # One for each state. Just for geometries and categorization really.
    class Meta:
        ordering = ['name']
        
    abbreviation = models.CharField(max_length=2)
    name = models.CharField(max_length=50)
    shape = models.MultiPolygonField(srid=900913)
    objects = models.GeoManager()
    
    def __unicode__(self):
        return self.name

class Deliverable(models.Model):
    # Deliverables defined in a state's statement-of-work
    class Meta:
        ordering = ['data_item']
        
    data_item = models.CharField(max_length=255)
    number_of_items = models.IntegerField(verbose_name='Minimum No. of Items')
    definition = models.TextField(blank=True)
    size = models.IntegerField(verbose_name='Data Size in MB', blank=True, null=True)
    delivery_plan = models.TextField()
    state = models.ForeignKey('State')
    category = models.CharField(max_length=50, choices=DELIVERABLE_CATEGORIES)
    objects = models.GeoManager()
    
    def __unicode__(self):
        return self.state.abbreviation + ': ' + self.data_item
    
    def is_satisfied(self):
        if len(self.submission_set.filter(approved=True)) > 0:
            return True
        else:
            return False

class Submission(models.Model):
    # Something a state has delivered in order to satisfy a deliverable
    class Meta:
        ordering = ['date_submitted']
        
    state = models.ForeignKey('State')
    date_submitted = models.DateField()
    data_type = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255)
    file_location = models.CharField(max_length=255)
    approved = models.BooleanField(default=False)
    satisfies_deliverable = models.ForeignKey('Deliverable')
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


