# Generated by Django 2.2.12 on 2021-10-19 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Crime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attempted_murder', models.IntegerField(max_length=4)),
                ('sexual_assualt', models.IntegerField(max_length=4)),
                ('vehicle_theft', models.IntegerField(max_length=4)),
                ('shoplifting', models.IntegerField(max_length=4)),
                ('drunk_driving', models.IntegerField(max_length=4)),
                ('damage_to_property', models.IntegerField(max_length=4)),
            ],
        ),
        migrations.CreateModel(
            name='Date',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.IntegerField(max_length=4)),
            ],
        ),
        migrations.CreateModel(
            name='Street',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street_name', models.CharField(max_length=100)),
            ],
        ),
    ]
