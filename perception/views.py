from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import *
import csv, io

# Create your views here.

def index(request): # Error check and validate the fuck out of this
    if request.method == "GET":
        return render(request, "perception/index.html")

    csv_file = request.FILES["csv_file"]
    data_set = csv_file.read().decode("UTF-8")
    io_string = io.StringIO(data_set)
    next(io_string)
    for column in csv.reader(io_string, delimiter = ',', quotechar = "|"):
        _, created = Crime.objects.update_or_create(
            year = int(column[0]),
            street_name = column[1],
            attempted_murder = int(column[2]),
            sexual_assault = int(column[3]),
            vehicle_theft = int(column[4]),
            shoplifting = int(column[5]),
            drunk_driving = int(column[6]),
            damage_to_property = int(column[7])
        )

    return render(request, "perception/index.html")

def about_us(request):
    return render(request, "perception/about_us.html")

def blog(request):
    return render(request, "perception/blog.html")

def documents(request):
    return render(request, "perception/documents.html")

def contact(request):
    return render(request, "perception/contact.html")

def map(request):
    return render(request, "perception/map.html")