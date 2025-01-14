from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.sql import func as server_func
from sqlalchemy.orm import Mapped, mapped_column

from src.database.base import BaseTable, int_pk, str_128, str_16
from src.models.schemas.tests import TestQuestionSchema, TestQuestionAnswerSchema, TestSchema, CompletedTestResultsSchema, TestResultSchema, TestTypes
from src.models.tables.users import UserTable


class Tags(BaseTable):
    __tablename__ = "tags"

    id: Mapped[int_pk]
    name: Mapped[str_16]


class TestsTags(BaseTable):
    __tablename__ = "tests_tags"

    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)


class TestQuestionAnswerTable(BaseTable):
    __tablename__ = "test_question_answers"

    id: Mapped[int_pk]
    test_question_id: Mapped[int] = mapped_column(ForeignKey("test_questions.id", ondelete="CASCADE"))
    answer: Mapped[str]
    points: Mapped[int]

    def to_schema_model(self) -> TestQuestionAnswerSchema:
        return TestQuestionAnswerSchema(
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
    # position?

    # answers: Mapped[list["TestQuestionAnswerTable"]] = relationship(lazy="noload")

    def to_schema_model(self) -> TestQuestionSchema:
        return TestQuestionSchema(
            id=self.id,
            test_id=self.test_id,
            title=self.title,
            type=TestTypes(self.type),
            # answers=[answer.to_schema_model() for answer in self.answers]
        )


class TestResultTable(BaseTable):
    __tablename__ = "test_results"

    id: Mapped[int_pk]
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"))
    min_points: Mapped[int]
    max_points: Mapped[int]
    content: Mapped[str]

    def to_schema_model(self) -> TestResultSchema:
        return TestResultSchema(
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
    author_user_id: Mapped[int] = mapped_column(ForeignKey("users.id")) # nullable?
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=server_func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=server_func.now())
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[int]

    def to_schema_model(self) -> TestSchema:
        return TestSchema(
            id=self.id,
            name=self.name,
            author_user_id=self.author_user_id,
            created_at=self.created_at,
            updated_at=self.updated_at,
            description=self.description,
            status=self.status,
        )


class CompletedTestResultsTable(BaseTable):
    __tablename__ = "user_test_results"

    test_result_id: Mapped[int] = mapped_column(ForeignKey(TestTable.id, ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey(UserTable.id, ondelete="CASCADE"), primary_key=True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=server_func.now())

    def to_schema_model(self) -> CompletedTestResultsSchema:
        return CompletedTestResultsSchema(
            id=self.id,
            test_result_id=self.test_result_id,
            user_id=self.user_id,
            date=self.date,
        )


class TestUserCommentTable(BaseTable):
    __tablename__ = "test_user_comment"
    
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    content: Mapped[Text]