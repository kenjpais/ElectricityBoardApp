from django.urls import path
from .views import index

app_name = "frontend"

urlpatterns = [
    path("", index, name=""),
    path("view-chart", index),
    path("manage-connections", index),
    path("edit-connection", index),
    path("create-user", index),
    path("info", index),
]
