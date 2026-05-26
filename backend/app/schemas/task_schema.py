from pydantic import (
    BaseModel,
    field_validator
)

from datetime import datetime

from typing import Optional


class TaskCreate(BaseModel):

    title: str

    description: Optional[str] = None

    priority: Optional[str] = "medium"

    due_date: Optional[datetime] = None

    assigned_to_id: Optional[int] = None


    # ✅ Title Validation
    @field_validator("title")
    @classmethod
    def validate_title(
        cls,
        value
    ):

        value = value.strip()

        if len(value) < 3:

            raise ValueError(
                "Title must contain minimum 3 characters"
            )

        return value


    # ✅ Description Validation
    @field_validator(
        "description"
    )
    @classmethod
    def validate_description(
        cls,
        value
    ):

        if value:

            value = value.strip()

        return value


    # ✅ Priority Validation
    @field_validator(
        "priority"
    )
    @classmethod
    def validate_priority(
        cls,
        value
    ):

        allowed = [

            "low",

            "medium",

            "high"
        ]

        value = value.lower()

        if value not in allowed:

            raise ValueError(
                "Priority must be low, medium or high"
            )

        return value


    # ✅ Due Date Validation
    @field_validator(
        "due_date"
    )
    @classmethod
    def validate_due_date(
        cls,
        value
    ):

        if value:

            if value < datetime.utcnow():

                raise ValueError(
                    "Due date cannot be past date"
                )

        return value


    # ✅ Assigned User Validation
    @field_validator(
        "assigned_to_id"
    )
    @classmethod
    def validate_user(
        cls,
        value
    ):

        if value:

            if value <= 0:

                raise ValueError(
                    "Invalid assigned user"
                )

        return value