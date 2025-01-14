from datetime import datetime
from enum import IntEnum
from pydantic import BaseModel
from src.models.enums import TestStatus


class TestTypes(IntEnum):
    SINGLE_ANSWER_OPTION = 1
    TEXT_FIELD = 2
    

class CreateTagSchema(BaseModel):
    name: str
    

class TagSchema(CreateTagSchema):
    id: int


class CreateTestQuestionAnswerSchema(BaseModel):
    answer: str
    points: int


class TestQuestionAnswerSchema(CreateTestQuestionAnswerSchema):
    id: int
    test_question_id: int


class CreateTestQuestionSchema(BaseModel):
    title: str
    type: TestTypes


class TestQuestionSchema(CreateTestQuestionSchema):
    id: int
    test_id: int


class CreateTestResultSchema(BaseModel):
    min_points: int
    max_points: int
    content: str


class TestResultSchema(CreateTestResultSchema):
    id: int
    test_id: int


class CreateTestSchema(BaseModel):
    name: str
    author_user_id: int
    description: str


class TestSchema(CreateTestSchema):
    id: int
    created_at: datetime
    updated_at: datetime
    status: TestStatus
    

class CompletedTestResultsSchema(BaseModel):
    test_result_id: int
    user_id: int
    date: datetime


class TestUserCommentSchema(BaseModel):    
    test_id: int
    user_id: int
    content: str
