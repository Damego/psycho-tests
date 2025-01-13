from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from sqlalchemy import DateTime, ForeignKey, PrimaryKeyConstraint 
from sqlalchemy.sql import func as server_func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.base import BaseTable, int_pk, str_128
from src.models.schemas.tests import TestQuestion, TestQuestionAnswer, TestResult, TestSchema, UserTestAnswer, UserTestResultSchema
from src.models.tables.users import UserTable


class TestQuestionAnswerTable(BaseTable):
    __tablename__ = "test_question_answers"

    id: Mapped[int_pk]
    test_question_id: Mapped[int] = mapped_column(ForeignKey("test_questions.id", ondelete="CASCADE"))
    answer: Mapped[str]
    points: Mapped[int]

    def to_schema_model(self) -> TestQuestionAnswer:
        return TestQuestionAnswer(
            id=self.id,
            test_question_id=self.test_question_id,
            answer=self.answer,
            points=self.points,
        )


class TestQuestionTable(BaseTable):
    __tablename__ = "test_questions"

    id: Mapped[int_pk]
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"))
    title: Mapped[str]
    type: Mapped[int]

    answers: Mapped[list["TestQuestionAnswerTable"]] = relationship(lazy="noload")

    def to_schema_model(self) -> TestQuestion:
        return TestQuestion(
            id=self.id,
            test_id=self.test_id,
            title=self.title,
            type=self.type,
            answers=[answer.to_schema_model() for answer in self.answers]
        )


class TestResultTable(BaseTable):
    __tablename__ = "test_results"

    id: Mapped[int_pk]
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"))
    min_points: Mapped[int]
    max_points: Mapped[int]
    content: Mapped[str]

    def to_schema_model(self) -> TestResult:
        return TestResult(
            id=self.id,
            test_id=self.test_id,
            min_points=self.min_points,
            max_points=self.max_points,
            content=self.content,
        )


class TestTable(BaseTable):
    __tablename__ = "tests"

    id: Mapped[int_pk]
    name: Mapped[str_128]

    questions: Mapped[list["TestQuestionTable"]] = relationship(lazy="noload")
    results: Mapped[list["TestResultTable"]] = relationship(lazy="noload")

    def to_schema_model(self) -> TestSchema:
        return TestSchema(
            id=self.id,
            name=self.name,
            questions=[q.to_schema_model() for q in self.questions],
            results=[r.to_schema_model() for r in self.results]
        )


class UserTestResultTable(BaseTable):
    __tablename__ = "user_test_results"

    id: Mapped[int_pk]
    test_id: Mapped[int] = mapped_column(ForeignKey(TestTable.id, ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(ForeignKey(UserTable.id, ondelete="CASCADE"))
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=server_func.now())

    answers: Mapped[list["UserTestAnswerTable"]] = relationship(lazy="noload")

    def to_schema_model(self) -> UserTestResultSchema:
        return UserTestResultSchema(
            id=self.id,
            test_id=self.test_id,
            user_id=self.user_id,
            date=self.date,
            answers=[a.to_schema_model() for a in self.answers]
        )


class UserTestAnswerTable(BaseTable):
    __tablename__ = "user_test_answer"

    user_test_result_id: Mapped[int] = mapped_column(ForeignKey("user_test_results.id", ondelete="CASCADE"))
    question_id: Mapped[int] = mapped_column(ForeignKey("test_questions.id", ondelete="CASCADE"))
    answer_id: Mapped[int] = mapped_column(ForeignKey("test_question_answers.id", ondelete="CASCADE"))

    __table_args__ = (
        PrimaryKeyConstraint("user_test_result_id", "question_id", "answer_id", name="user_test_answer_pk"),
    )

    def to_schema_model(self) -> UserTestAnswer:
        return UserTestAnswer(
            user_test_result_id=self.user_test_result_id,
            question_id=self.question_id,
            answer_id=self.answer_id
        )
