from pydantic import (
    BaseModel,
    EmailStr,
    field_validator
)

import re


class UserCreate(BaseModel):

    name: str

    email: EmailStr

    password: str

    role: str


    # ✅ Name Validation
    @field_validator("name")
    @classmethod
    def validate_name(
        cls,
        value
    ):

        value = value.strip()

        if len(value) < 3:

            raise ValueError(
                "Name must contain minimum 3 characters"
            )

        return value


    # ✅ Password Validation
    @field_validator("password")
    @classmethod
    def validate_password(
        cls,
        value
    ):

        if len(value) < 8:

            raise ValueError(
                "Password must contain minimum 8 characters"
            )

        if not re.search(
            r"[A-Z]",
            value
        ):

            raise ValueError(
                "Password must contain uppercase letter"
            )

        if not re.search(
            r"[0-9]",
            value
        ):

            raise ValueError(
                "Password must contain number"
            )

        return value


    # ✅ Role Validation
    @field_validator("role")
    @classmethod
    def validate_role(
        cls,
        value
    ):

        allowed_roles = [

            "admin",

            "manager",

            "employee"
        ]

        value = value.lower()

        if value not in allowed_roles:

            raise ValueError(
                "Invalid role"
            )

        return value


class UserLogin(BaseModel):

    email: EmailStr

    password: str


    @field_validator(
        "password"
    )
    @classmethod
    def validate_password(
        cls,
        value
    ):

        value = value.strip()

        if not value:

            raise ValueError(
                "Password required"
            )

        return value