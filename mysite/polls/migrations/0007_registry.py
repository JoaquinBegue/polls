# Generated by Django 5.0.7 on 2024-10-09 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0006_remove_choice_question_poll_choice_poll_vote_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Registry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_count', models.IntegerField()),
                ('poll_count', models.IntegerField()),
            ],
        ),
    ]
