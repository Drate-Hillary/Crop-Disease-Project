from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
import re
from django.utils.encoding import force_str
from django.contrib.auth.hashers import make_password

User = get_user_model()

def signUp(request):
    if request.method == 'POST':
        # Get form data
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        newsletter = request.POST.get('newsletter', False)
        
        # Validation
        errors = []
        
        # Check if passwords match
        if password != confirm_password:
            errors.append("Passwords do not match.")
        
        # Check password strength
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', password):
            errors.append("Password must contain at least one number.")
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            errors.append("Email is already registered. Please use a different email or login.")
        
        # Validate phone number if provided
        if phone and not re.match(r'^\+?1?\d{9,15}$', phone):
            errors.append("Please enter a valid phone number.")
        
        if errors:
            for error in errors:
                messages.error(request, error)
            return render(request, "signInSignUp/sign_up.html")
        
        try:
            # Create user
            user = User.objects.create(
                email=email,
                password=make_password(password),
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                is_active=False  # User will be activated after email verification
            )
            
            # Send verification email
            send_verification_email(request, user)
            
            messages.success(request, 'Registration successful! Please check your email to verify your account.')
            return redirect('sign-up')
            
        except Exception as e:
            messages.error(request, f'Error during registration: {str(e)}')
            return render(request, "signInSignUp/sign_up.html")
    
    return render(request, "signInSignUp/sign_up.html")

def send_verification_email(request, user):
    # Generate token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Build verification link
    verification_link = request.build_absolute_uri(
        f'/verify-email/{uid}/{token}/'
    )
    
    # Email content
    subject = 'Verify Your Email Address'
    message = render_to_string('signInSignUp/email_verification.html', {
        'user': user,
        'verification_link': verification_link,
    })
    
    # Send email
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
        html_message=message
    )


def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        messages.success(request, 'Your email has been verified successfully! You can now login.')
        return redirect('sign-in')
    else:
        messages.error(request, 'The verification link is invalid or has expired.')
        return redirect('sign-up')


def signIn(request):
    return render(request, "signInSignUp/sign_in.html")


def forgot_password(request):
    return render(request, "signInSignUp/forgot_password.html")