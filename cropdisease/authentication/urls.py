from django.urls import path
from .views import signIn, signUp, verify_email, forgot_password

urlpatterns =[
    path('sign-in/', signIn, name='sign-in'),
    path('sign-up/', signUp, name='sign-up'),
    path('verify-email/<uidb64>/<token>/', verify_email, name='verify-email'),
    path('forgot_password/', forgot_password, name="forgot_password")
]