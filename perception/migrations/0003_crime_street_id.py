# Generated by Django 2.2.12 on 2021-10-21 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('perception', '0002_auto_20211019_1232'),
    ]

    operations = [
        migrations.AddField(
            model_name='crime',
            name='street_id',
            field=models.IntegerField(null=True),
        ),
    ]
