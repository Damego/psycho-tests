from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func

from src.models.tables.tables import TestTable, TestQuestionAnswerTable, TestQuestionTable, TestResultTable, Tags, TestsTags
from src.models.schemas.tests import TagSchema, TestResult
from src.utils.abstract.db_repository import SQLAlchemyRepository
from src.database.session import async_session_maker

class TestQuestionAnswerRepository(SQLAlchemyRepository):
    table_model = TestQuestionAnswerTable


class TestQuestionRepository(SQLAlchemyRepository):
    table_model = TestQuestionTable

    options = [selectinload(TestQuestionTable.answers)]


class TestResultRepository(SQLAlchemyRepository):
    table_model = TestResultTable


class TestRepository(SQLAlchemyRepository):
    table_model = TestTable

    # options = [
    #     selectinload(TestTable.questions).selectinload(TestQuestionTable.answers),
    #     selectinload(TestTable.results)
    # ]


class UserTestResultRepository(SQLAlchemyRepository):
    table_model = TestResultTable


class TagsRepository(SQLAlchemyRepository[TagSchema]):
    table_model = Tags


class TestsTagsRepository(SQLAlchemyRepository):
    table_model = TestsTags
