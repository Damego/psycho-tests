from pydantic import BaseModel

from src.models.schemas.tests import TestQuestion, TestResult


class TestUpdate(BaseModel):
    name: str
    questions: list[TestQuestion]
    results: list[TestResult]
