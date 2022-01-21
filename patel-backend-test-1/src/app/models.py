from django.contrib.auth.models import AbstractBaseUser
from django.db.models import BooleanField, DateTimeField, EmailField
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractBaseUser):
    email = EmailField(_('email address'), unique=True)
    is_active = BooleanField(default=True)
    created = DateTimeField(default=timezone.now)
    # The following line is a workaround for strawberry-django using original
    # User model: https://github.com/strawberry-graphql/strawberry-graphql-django/blob/7ec710bf62bd599442601d0a9605e7bedf1dfca1/strawberry_django/auth/mutations.py#L17
    username = EmailField(_('username'), default=None)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
