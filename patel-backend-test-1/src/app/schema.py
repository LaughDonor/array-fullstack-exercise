from typing import Optional

from strawberry import Schema
from strawberry import type as strawberry_type
from strawberry.django import auth

from .types import User, UserInput


@strawberry_type
class Query:
    login: Optional[User] = auth.login()
    logout: bool = auth.logout()
    me: Optional[User] = auth.current_user()


@strawberry_type
class Mutation:
    register: Optional[User] = auth.register(UserInput)


schema = Schema(query=Query, mutation=Mutation)
