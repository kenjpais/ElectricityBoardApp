from django.db import models


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=100, unique=True)
    Applicant_Name = models.CharField(max_length=100)
    Gender = models.CharField(max_length=5)
    GovtID_Type = models.CharField(max_length=50)
    District = models.CharField(max_length=100)
    State = models.CharField(max_length=100)
    Pincode = models.CharField(max_length=20)
    
class Connection(models.Model):
    ID = models.AutoField(primary_key=True)
    Applicant_Name = models.CharField(max_length=100)
    Gender = models.CharField(max_length=10)
    District = models.CharField(max_length=100)
    State = models.CharField(max_length=100)
    Pincode = models.CharField(max_length=20)
    Ownership = models.CharField(max_length=50)
    GovtID_Type = models.CharField(max_length=50)
    ID_Number = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections', to_field='id')
    Category = models.CharField(max_length=50, null=True)
    Load_Applied = models.IntegerField()
    Date_of_Application = models.DateField()
    Date_of_Approval = models.DateField(null=True)
    Modified_Date = models.DateField()
    Status = models.CharField(max_length=50)
    Reviewer_ID = models.IntegerField(null=True)
    Reviewer_Name = models.CharField(max_length=100, null=True)
    Reviewer_Comments = models.TextField(null=True)
