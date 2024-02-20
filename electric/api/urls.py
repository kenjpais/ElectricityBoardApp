from django.urls import path
from .views import *

urlpatterns = [
    path('connection/<int:pk>/', connection_detail),
    path("filter-connections", filter_connections, name="filter-connections"),
    path("create-connection", create_connection, name="create-connection"),
    path("create-user", create_user, name="create-user")
]
