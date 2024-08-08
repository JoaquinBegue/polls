from django.forms import ModelForm, TextInput, Select, inlineformset_factory
from .models import Question, Choice


class QuestionForm(ModelForm):
    class Meta:
        model = Question
        fields = ["question_text", "category"]
        labels = {"question_text": "Question", "category": "Choose a category"}
        widgets = {
            "question_text": TextInput(attrs={
                "class": "form-control",
                "placeholder": "Write the poll's question here"}),
            "category": Select(attrs={
                "class": "form-control"})
        }

class ChoiceForm(ModelForm):
    class Meta:
        model = Choice
        fields = ["choice_text"]
        labels = {"choice_text": ""}
        widgets = {
            "choice_text": TextInput(attrs={
                "class": "form-control",
                "placeholder": "Write a poll's option here"})
        }

ChoiceFormSet = inlineformset_factory(Question, Choice, form=ChoiceForm, extra=2)