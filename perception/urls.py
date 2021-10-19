from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about_us", views.about_us, name="about_us"),
    path("blog", views.blog, name="blog"),
    path("documents", views.documents, name="documents"),
    path("contact", views.contact, name="contact"),
    path("map", views.map, name="map"),
]