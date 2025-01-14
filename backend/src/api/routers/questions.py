from fastapi import APIRouter

from src.api.dependencies import TestsServiceDep, IAdminUser
from src.models.schemas.tests import CreateTestQuestionSchema
from src.models.schemas.update import UpdateTestQuestionSchema

router = APIRouter(tags=["Психологические тесты::Вопросы"])


@router.get("/tests/{test_id}/questions")
async def get_test_questions(test_id: int, service: TestsServiceDep):
    return await service.get_test_questions(test_id)


@router.post("/tests/{test_id}/questions")
async def add_question_to_test(test_id: int, payload: CreateTestQuestionSchema, user: IAdminUser, service: TestsServiceDep):
    return await service.add_test_question(test_id, payload)


@router.patch("/tests/{test_id}/questions/{question_id}")
async def update_test_question(test_id: int, question_id: int, payload: UpdateTestQuestionSchema, user: IAdminUser, service: TestsServiceDep):
    return await service.update_test_question(question_id, payload)


@router.delete("/tests/{test_id}/questions/{question_id}")
async def delete_test_question(test_id: int, question_id: int, user: IAdminUser, service: TestsServiceDep):
    return await service.delete_test_question(question_id)
