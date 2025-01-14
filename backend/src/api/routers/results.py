from fastapi import APIRouter

from src.api.dependencies import TestsServiceDep, IAdminUser
from src.models.schemas.tests import CreateTestResultSchema
from src.models.schemas.update import UpdateTestResultSchema

router = APIRouter(tags=["Психологические тесты::Результаты теста"])


@router.get("/tests/{test_id}/results")
async def get_test_results(test_id: int, service: TestsServiceDep):
    return await service.get_test_results(test_id)


@router.post("/tests/{test_id}/results")
async def add_test_result(test_id: int, payload: list[CreateTestResultSchema], user: IAdminUser, service: TestsServiceDep):
    return await service.add_test_results(test_id, payload)


@router.patch("/tests/{test_id}/results/{result_id}")
async def update_test_result(test_id: int, result_id: int, payload: UpdateTestResultSchema, user: IAdminUser, service: TestsServiceDep):
    return await service.update_test_result(result_id, payload)


@router.delete("/tests/{test_id}/results/{result_id}")
async def delete_test_result(test_id: int, result_id: int, user: IAdminUser, service: TestsServiceDep):
    return await service.delete_test_result(result_id)
