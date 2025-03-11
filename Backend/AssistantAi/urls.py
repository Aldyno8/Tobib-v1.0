from django.urls import path
from .views import *

urlpatterns = [
    path("Symptoms/", PostSymptoms.as_view(), name="Symptoms"),
    path("Exercice/", CreateExercices.as_view(), name="createExercice"),
    path("Recipes/", CreateRecipe.as_view(), name="Recipes"),
]
