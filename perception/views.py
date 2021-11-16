from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.db.models import Sum
from .models import *
from .forms import ContactForm
from django.contrib import messages
from django.core.mail import send_mail
import csv, io, operator

# Create your views here.

def index(request):
    return render(request, "perception/index.html")

def about_us(request):
    return render(request, "perception/about_us.html")

def blog(request):
    return render(request, "perception/blog.html")

def blog_one(request):
    return render(request, "perception/blog_one.html")

def blog_two(request):
    return render(request, "perception/blog_two.html")

def documents(request):
    return render(request, "perception/documentation.html")

def contact(request):
    # If form is received
    if request.method == "POST":
        contact_form = ContactForm(request.POST)
        if contact_form.is_valid():
            contact_form.save()
            # Send email to user who sent form
            subject = "Contact Form Message"
            body = {
                'intro': f"Good day {contact_form.cleaned_data['name'].capitalize()}" + "\n",
                'body': "Thank you for your message! A member of our team members will get back to you as soon as possible." + "\n",
                'outro': "Regards" + "\n" + "GitHubbers team"
            }
            message = "\n".join(body.values())
            sender = "githubbers07@gmail.com"
            recipient = [contact_form.cleaned_data['email_address']]

            send_mail(subject, message, sender, recipient, fail_silently = True)

            return render(request, "perception/contact.html", {
                "contact_form": ContactForm()
            })
    # If GET request send a blank form
    else:
        contact_form = ContactForm()
    
    # New instance of form
    return render(request, "perception/contact.html", {
        "contact_form": contact_form
    })



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
    def get_data(query, index=1):
        v = []
        for q in query:
            v.append(q[index])
        return v

    keys = [
        "years",
        "attempted_murder",
        "sexual_assault",
        "vehicle_theft",
        "shoplifting",
        "drunk_driving",
        "damage_to_property"
    ]

    values = []
    if request.method == "GET":
        first = Crime.objects.values_list('year').annotate(Sum('attempted_murder'))
        values.append(get_data(first, 0))
        values.append(get_data(first))
        values.append(get_data(Crime.objects.values_list('year').annotate(Sum('sexual_assault'))))
        values.append(get_data(Crime.objects.values_list('year').annotate(Sum('vehicle_theft'))))
        values.append(get_data(Crime.objects.values_list('year').annotate(Sum('shoplifting'))))
        values.append(get_data(Crime.objects.values_list('year').annotate(Sum('drunk_driving'))))
        values.append(get_data(Crime.objects.values_list('year').annotate(Sum('damage_to_property'))))

    crime_data = {}
    for k, v in zip(keys, values):
        crime_data[k] = v

    return JsonResponse(crime_data, safe=False)
    
# Function gets the most recent years data in the database (19 streets total)
# Loops through the names and sums the all the crimes for that road
# returns a JSON object with the crime total for that street
def total_crimes(request):
    if request.method == "GET":
        street_names = Crime.objects.values_list('street_name', flat = True).order_by('-id')[:19]
        sum_crime_street = {}

        for name in street_names:
            street_crime_sum = Crime.objects.filter(street_name = name).values_list('attempted_murder', 'sexual_assault', 'vehicle_theft', 'shoplifting', 'drunk_driving', 'damage_to_property').order_by('-id')[:19]
            sum_crime_street[(name)] = sum(street_crime_sum[0])
        
        sorted_sum_crime_street = dict(sorted(sum_crime_street.items()))

        latest_year = Crime.objects.values_list('year', flat = True).last()
        sorted_sum_crime_street['year'] = latest_year

        return JsonResponse(sorted_sum_crime_street, safe = False)

def map(request):
    return render(request, "perception/map.html")

