from django.contrib.auth import get_user_model
from strawberry.django import auto
from strawberry.django import input as strawberry_input
from strawberry.django import type as strawberry_type


@strawberry_type(get_user_model())
class User:
    email: auto


@strawberry_input(get_user_model())
class UserInput:
    email: auto
    password: auto
