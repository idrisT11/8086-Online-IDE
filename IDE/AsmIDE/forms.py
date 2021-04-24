from django import forms 

class CreateTest(forms.Form):

    test_id = forms.IntegerField(label="Test id",required=False, widget=forms.NumberInput(attrs={'class':'someclass'}))
    test_duration = forms.IntegerField(label="Test duration", required=False, widget=forms.NumberInput(attrs={'class':'someclass'}))
    test_passwd = forms.CharField(max_length=30, widget=forms.PasswordInput(attrs={'class':'someclass'}), required=False)

class DeleteTest(forms.Form):

    test_passwd = forms.CharField(max_length=30, required=False, widget=forms.PasswordInput())


class Submission(forms.Form):

    first_name = forms.CharField(label="First name", required=False, widget=forms.TextInput(attrs={'class':'wsh'}))
    family_name = forms.CharField(label="Family name", required=False, widget=forms.TextInput(attrs={'class':'wsh'}))
    email = forms.EmailField(label="Email",required=False, widget=forms.EmailInput(attrs={'class':'someclass'}))
    group = forms.IntegerField(label="group",required=False, widget=forms.NumberInput(attrs={'class':'someclass'}))

    test_id = forms.IntegerField(label="Test id",required=False, widget=forms.NumberInput(attrs={'class':'someclass'}))
    test_passwd = forms.CharField(label="Test password", max_length=30, widget=forms.PasswordInput(attrs={'class':'someclass'}), required=False)
    