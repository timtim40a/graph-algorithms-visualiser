from django.db import models

class Node(models.Model):
    id = models.IntegerField(primary_key=True)
    value = models.CharField(max_length=30)
    x = models.IntegerField()
    y = models.IntegerField()

    def __str__(self) -> str:
        return self.value