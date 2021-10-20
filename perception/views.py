from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import *
import csv, io

# Create your views here.

def index(request):
    return render(request, "perception/index.html")

def about_us(request):
    return render(request, "perception/about_us.html")

def blog(request):
    return render(request, "perception/blog.html")

def documents(request):
    return render(request, "perception/documents.html")

def contact(request):
    return render(request, "perception/contact.html")

def load_data(request):
    if request.method == "GET":
        return render(request, "perception/load_data.html")
    
    if request.method == "POST":
        try:
            csv_file = request.FILES["csv_file"]

            # If file csv continue
            if csv_file.name.endswith(".csv"):
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
                return render(request, "perception/map.html")
            else:
                return render(request, "perception/load_data.html", {
                    "message": "Please Upload a CSV File"
                })
        except:
            return render(request, "perception/load_data.html", {
                "message": "Please Upload a File"
            })

def crime_data(request):
    if request.method == "GET":
        years = Crime.objects.values_list('year', flat = True)
        year_list = []
        for year in years:
            year_list.append(year)

        street_names = Crime.objects.values_list('street_name', flat = True)
        street_name_list = []
        for street_name in street_names:
            street_name_list.append(street_name)

        attempted_murders = Crime.objects.values_list('attempted_murder', flat = True)
        attempted_murder_list = []
        for attempted_murder in attempted_murders:
            attempted_murder_list.append(attempted_murder)

        sexual_assaults = Crime.objects.values_list('sexual_assault', flat = True)
        sexual_assault_list = []
        for sexual_assault in sexual_assaults:
            sexual_assault_list.append(sexual_assault)

        vehicle_thefts = Crime.objects.values_list('vehicle_theft', flat = True)
        vehicle_theft_list = []
        for vehicle_theft in vehicle_thefts:
            vehicle_theft_list.append(vehicle_theft)

        shopliftings = Crime.objects.values_list('shoplifting', flat = True)
        shoplifting_list = []
        for shoplifting in shopliftings:
            shoplifting_list.append(shoplifting)

        drunk_drivings = Crime.objects.values_list('drunk_driving', flat = True)
        drunk_driving_list = []
        for drunk_driving in drunk_drivings:
            drunk_driving_list.append(drunk_driving)

        damage_to_properties = Crime.objects.values_list('damage_to_property', flat = True)
        damage_to_property_list = []
        for damage_to_property in damage_to_properties:
            damage_to_property_list.append(damage_to_property)

        crime_data = [{
            'year': year_list,
            'street_name': street_name_list,
            'attempted_murder': attempted_murder_list,
            'sexual_assault': sexual_assault_list,
            'vehicle_theft': vehicle_theft_list,
            'shoplifting': shoplifting_list,
            'drunk_driving': drunk_driving_list,
            'damage_to_property': damage_to_property_list
        }]

        return JsonResponse(crime_data, safe = False)   



def map(request):
    return render(request, "perception/map.html")