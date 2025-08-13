from django.shortcuts import render

# Create your views here.
def dashboard_view(request):
    return render(request, 'partials/dashboard.html', {
        'page_title': 'Agronomist Dashboard'
    })