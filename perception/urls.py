from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about_us", views.about_us, name="about_us"),
    path("blog", views.blog, name="blog"),
    path("documents", views.documents, name="documents"),
    path("contact", views.contact, name="contact"),
    path("load_data", views.load_data, name="load_data"),
    path("map", views.map, name="map"),
    # API routes
    path("crime_data", views.crime_data, name="crime_data"),
    path("total_crimes", views.total_crimes, name="total_crimes")
]