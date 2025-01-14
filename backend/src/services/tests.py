from src.models.enums import TestStatus
from src.models.schemas.tests import CreateTagSchema, CreateTestQuestionAnswerSchema, CreateTestQuestionSchema, CreateTestResultSchema, TagSchema, TestQuestionSchema, TestQuestionAnswerSchema, TestResultSchema, TestSchema, CreateTestSchema
from src.models.schemas.update import UpdateTagSchema, UpdateTestQuestionSchema, UpdateTestQuestionAnswerSchema, UpdateTestResultSchema, UpdateTestSchema
from src.repositories.tests_repository import (
    TestQuestionAnswerRepository,
    TestQuestionRepository,
    TestResultRepository,
    TestRepository,
    UserTestResultRepository,
    TagsRepository,
    TestsTagsRepository
)


class TestsService:
    def __init__(self) -> None:
        self.test_question_answer_repo = TestQuestionAnswerRepository()
        self.test_question_repo = TestQuestionRepository()
        self.test_result_repo = TestResultRepository()
        self.test_repo = TestRepository()
        self.user_test_result_repo = UserTestResultRepository()
        # self.user_test_answer_repo = UserTestAnswerRepository()
        self.tags_repo = TagsRepository()
        self.tests_tags_repo = TestsTagsRepository()
    
    # Теги
    
    async def get_tags(self) -> list[TagSchema]:
        return await self.tags_repo.get_all()

    async def add_tag(self, payload: CreateTagSchema) -> TagSchema:
        return await self.tags_repo.add_one(payload.model_dump())
    
    async def update_tag(self, tag_id: int, payload: UpdateTagSchema) -> TagSchema:
        return await self.tags_repo.update_by_id(tag_id, payload.model_dump(exclude_none=True))
    
    async def delete_tag(self, tag_id: int) -> None:
        return await self.tags_repo.remove_by_id(tag_id)

    # Тесты
    
    async def get_test_list(self) -> list[TestSchema]:
        return await self.test_repo.get_all()
    
    async def get_test_by_id(self, id: int) -> TestSchema:
        return await self.test_repo.get_by_id(id)
    
    async def get_tests_by_tag(self, tag_ids: list[int]):
        ...

    async def add_test(self, payload: CreateTestSchema):
        test_payload = payload.model_dump()
        test_payload["status"] = TestStatus.DRAFT

        return await self.test_repo.add_one(test_payload)

    async def update_test(self, id: int, payload: UpdateTestSchema):
        test_payload = payload.model_dump(exclude_none=True)
        return await self.test_repo.update_by_id(id, test_payload)

    async def delete_test(self, id: int):
        await self.test_repo.remove_by_id(id)

    # Вопросы на тест
    
    async def get_test_questions(self, test_id: int):
        return await self.test_question_repo.get_one(test_id=test_id)

    async def add_test_question(self, test_id: int, payload: CreateTestQuestionSchema):
        data = payload.model_dump()
        return await self.test_question_repo.add_one({"test_id": test_id, **data})
    
    async def update_test_question(self, question_id: int, payload: UpdateTestQuestionSchema):
        data = payload.model_dump(exclude_none=True)
        return await self.test_question_repo.update_by_id(question_id, data)

    async def delete_test_question(self, question_id: int):
        return await self.test_question_repo.remove_by_id(question_id)

    # Ответы на вопрос теста
    
    async def get_test_question_answers(self, question_id: int):
        return await self.test_question_answer_repo.get_many(question_id=question_id)
    
    async def add_test_answer_questions(self, question_id: int, payload: list[CreateTestQuestionAnswerSchema]):
        data = [p.model_dump() for p in payload]
        for d in data:
            d["test_question_id"] = question_id

        return await self.test_question_answer_repo.add_many(data)
    
    async def update_test_answer_question(self, answer_id: int, payload: UpdateTestQuestionAnswerSchema):
        data = payload.model_dump(exclude_none=True)
        return await self.test_question_answer_repo.update_by_id(answer_id, data)

    async def delete_test_answer_question(self, answer_id: int):
        return await self.test_question_answer_repo.remove_by_id(answer_id)
    
    # Результат теста
    
    async def get_test_results(self, test_id: int):
        return await self.test_result_repo.get_many(test_id=test_id)
    
    async def add_test_results(self, test_id: int, payload: list[CreateTestResultSchema]):
        data = [p.model_dump() for p in payload]
        for d in data:
            d["test_id"] = test_id
        return await self.test_result_repo.add_many(data)

    async def update_test_result(self, test_result_id: int, payload: UpdateTestResultSchema):
        data = payload.model_dump(exclude_none=True)
        return await self.test_result_repo.update_by_id(test_result_id, data)

    async def delete_test_result(self, test_result_id: int):
        return await self.test_result_repo.remove_by_id(test_result_id)


