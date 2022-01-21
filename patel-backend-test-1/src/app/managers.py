from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    User model manager to handle emails as primary key instead of username
    """

    def create_user(self, email, password, **extra_fields):
        """
        Create User from the provided email and password
        """
        if not email:
            raise ValueError(_('Email is required'))
        email = self.normalize_email(email)
        # The following line is a workaround for strawberry-django utilizing
        # the original User model: https://github.com/strawberry-graphql/strawberry-graphql-django/blob/7ec710bf62bd599442601d0a9605e7bedf1dfca1/strawberry_django/auth/mutations.py#L17
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
