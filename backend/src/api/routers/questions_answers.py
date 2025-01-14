from fastapi import APIRouter

from src.api.dependencies import TestsServiceDep, IAdminUser
from src.models.schemas.tests import CreateTestQuestionAnswerSchema
from src.models.schemas.update import UpdateTestQuestionAnswerSchema

router = APIRouter(tags=["Психологические тесты::Ответы на вопросы"])


@router.get("/tests/{test_id}/questions/{question_id}/answers")
async def get_question_answers(test_id: int, question_id: int, service: TestsServiceDep):
    return await service.get_test_question_answers(question_id)


@router.post("/tests/{test_id}/questions/{question_id}/answers")
async def add_question_answers(test_id: int, question_id: int, payload: list[CreateTestQuestionAnswerSchema], user: IAdminUser, service: TestsServiceDep):
    return await service.add_test_answer_questions(question_id, payload)


@router.post("/tests/{test_id}/questions/{question_id}/answers/{answer_id}")
async def update_question_answer(test_id: int, question_id: int, answer_id: int, payload: UpdateTestQuestionAnswerSchema, user: IAdminUser, service: TestsServiceDep):
    return await service.update_test_answer_question(answer_id, payload)


@router.delete("/tests/{test_id}/questions/{question_id}/answers/{answer_id}")
async def delete_question_answer(test_id: int, question_id: int, answer_id: int, user: IAdminUser, service: TestsServiceDep):
    return await service.delete_test_answer_question(answer_id)
