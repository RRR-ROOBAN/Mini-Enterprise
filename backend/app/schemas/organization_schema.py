from pydantic import BaseModel


class OrganizationCreate(

    BaseModel

):

    name:str

    plan:str="Basic"


class OrganizationResponse(

    BaseModel

):

    id:int

    name:str

    plan:str

    credits:int

    class Config:

        from_attributes=True