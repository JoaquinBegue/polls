# Generated by Django 5.0.7 on 2024-10-09 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0008_registry_vote_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registry',
            name='poll_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='registry',
            name='user_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='registry',
            name='vote_count',
            field=models.IntegerField(default=0),
        ),
    ]
