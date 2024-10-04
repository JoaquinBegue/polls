from django.forms import ModelForm, TextInput, Select, inlineformset_factory
from .models import Poll, Choice


class PollForm(ModelForm):
    class Meta:
        model = Poll
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
                "placeholder": "Enter a choice here"})
        }

ChoiceFormSet = inlineformset_factory(
    Poll, Choice, form=ChoiceForm,
    extra=0,
    min_num=2,
    validate_min=True,
    can_delete=False
)