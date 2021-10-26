from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.db.models import Max
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



# load_data function receive a csv file from the form and loops through the data adding it to the database
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
                        street_id = int(column[1]),
                        street_name = column[2],
                        attempted_murder = int(column[3]),
                        sexual_assault = int(column[4]),
                        vehicle_theft = int(column[5]),
                        shoplifting = int(column[6]),
                        drunk_driving = int(column[7]),
                        damage_to_property = int(column[8])
                    )
                # If succesful load the map page with the new data in the database
                return HttpResponseRedirect(reverse('map'))
            else:
                # If file is not a csv display message
                return render(request, "perception/load_data.html", {
                    "message": "Please Upload a CSV File"
                })
        except:
            # If upload button pressed with no file attached display message
            return render(request, "perception/load_data.html", {
                "message": "Please Upload a File"
            })

# crime_data function queries the database for year, street_id, street_name, attempted_murder, sexual_assault, vehicle_theft, shoplifting, drunk_driving and damage_to_property
# These items are turned into a list 
# a JSON object is created and returned 
def crime_data(request):
    if request.method == "GET":
        year = list(Crime.objects.values_list('year', flat = True))
        street_id = list(Crime.objects.values_list('street_id', flat = True))
        street_name = list(Crime.objects.values_list('street_name', flat = True))
        attempted_murder = list(Crime.objects.values_list('attempted_murder', flat = True))
        sexual_assault = list(Crime.objects.values_list('sexual_assault', flat = True))
        vehicle_theft = list(Crime.objects.values_list('vehicle_theft', flat = True))
        shoplifting = list(Crime.objects.values_list('shoplifting', flat = True))
        drunk_driving = list(Crime.objects.values_list('drunk_driving', flat = True))
        damage_to_property = list(Crime.objects.values_list('damage_to_property', flat = True))

        crime_data = {
            'year': year,
            'street_id': street_id,
            'street_name': street_name,
            'attempted_murder': attempted_murder,
            'attempted_murder_total': sum(attempted_murder),
            'sexual_assault': sexual_assault,
            'sexual_assault_total': sum(sexual_assault),
            'vehicle_theft': vehicle_theft,
            'vehicle_theft_total': sum(vehicle_theft),
            'shoplifting': shoplifting,
            'shoplifting_total': sum(shoplifting),
            'drunk_driving': drunk_driving,
            'drunk_driving_total': sum(drunk_driving),
            'damage_to_property': damage_to_property,
            'damage_to_property_total': sum(damage_to_property),
        }

        return JsonResponse(crime_data, safe = False)   

# Function gets the most recent years data in the database (19 streets total)
# Loops through the names and sums the all the crimes for that road
# returns a JSON object with the crime total for that street
def total_crimes(request):
    if request.method == "GET":
        street_names = Crime.objects.values_list('street_name', flat = True).order_by('-id')[:19]
        sum_crime_street = {}
        for name in street_names:
            street_crime_sum = Crime.objects.filter(street_name = name).values_list('attempted_murder', 'sexual_assault', 'vehicle_theft', 'shoplifting', 'drunk_driving', 'damage_to_property').order_by('-id')[:19]
            sum_crime_street[(name.replace(" ", "_")).lower()] = sum(street_crime_sum[0])
        return JsonResponse(sum_crime_street, safe = False)

def map(request):
    return render(request, "perception/map.html")
