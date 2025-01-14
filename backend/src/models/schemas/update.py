from typing import Optional

from pydantic import BaseModel, Field

from src.models.enums import TestStatus
from src.models.schemas.tests import TestTypes


class UpdateTagSchema(BaseModel):
    name: str


class UpdateTestSchema(BaseModel):
    name: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    status: Optional[TestStatus] = Field(None)


class UpdateTestQuestionSchema(BaseModel):
    title: Optional[str] = Field(None)
    type: Optional[TestTypes] = Field(None)
    

class UpdateTestQuestionAnswerSchema(BaseModel):
    answer: Optional[str] = Field(None)
    points: Optional[int] = Field(None)


class UpdateTestResultSchema(BaseModel):
    min_points: Optional[int] = Field(None)
    max_points: Optional[int] = Field(None)
    content: Optional[str] = Field(None)


