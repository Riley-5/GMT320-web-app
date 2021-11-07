from django import forms
from .models import Contact
from django.forms import TextInput, EmailInput, NumberInput, Textarea

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ("name", "email_address", "phone_number", "subject", "message")
        widgets = {
            'name': TextInput(attrs = {
                'class': "form-control",
                'placeholder': "Name"
            }),
            'email_address': EmailInput(attrs = {
                'class': "form-control",
                'placeholder': "example@gmail.com"
            }),
            'phone_number': NumberInput(attrs = {
                'class': "form-control",
                'placeholder': "123 456 7890"
            }),
            'subject': TextInput(attrs = {
                'class': "form-control"
            }),
            'message': Textarea(attrs = {
                'class': "form-control",
                'style': 'max-height: 25vh;' 
            })
        }