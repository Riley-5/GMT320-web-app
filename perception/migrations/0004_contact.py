# Generated by Django 2.2.12 on 2021-11-07 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('perception', '0003_crime_street_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email_address', models.EmailField(max_length=254)),
                ('phone_number', models.IntegerField()),
                ('subject', models.CharField(max_length=500)),
                ('message', models.TextField()),
            ],
        ),
    ]