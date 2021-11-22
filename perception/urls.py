from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about_us", views.about_us, name="about_us"),
    path("blog", views.blog, name="blog"),
    path("blog_one", views.blog_one, name="blog_one"),
    path("blog_two", views.blog_two, name="blog_two"),
    path("blog_three", views.blog_three, name="blog_three"),
    path("blog_four", views.blog_four, name="blog_four"),
    path("documents", views.documents, name="documents"),
    path("contact", views.contact, name="contact"),
    path("load_data", views.load_data, name="load_data"),
    path("map", views.map, name="map"),
    # API routes
    path("crime_data", views.crime_data, name="crime_data"),
    path("total_crimes", views.total_crimes, name="total_crimes")
]