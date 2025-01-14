from fastapi import APIRouter

from src.api.dependencies import TestsServiceDep, IAdminUser
from src.models.schemas.tests import TestSchema, CreateTestSchema
from src.models.schemas.update import UpdateTestSchema

router = APIRouter(tags=["Психологические тесты"])


@router.get("/tests/list")
async def get_test_list(service: TestsServiceDep) -> list[TestSchema]:
    return await service.get_test_list()


@router.get("/tests/{test_id}")
async def get_test_by_id(test_id: int, service: TestsServiceDep) -> TestSchema | None:
    return await service.get_test_by_id(test_id)


@router.post("/tests")
async def add_test(test_create: CreateTestSchema, user: IAdminUser, service: TestsServiceDep):
    await service.add_test(test_create)


@router.patch("/tests/{test_id}")
async def update_test(test_id: int, test_update: UpdateTestSchema, user: IAdminUser, service: TestsServiceDep):
    await service.update_test(test_id, test_update)


@router.delete("/tests/{test_id}")
async def delete_test(test_id: int, user: IAdminUser, service: TestsServiceDep):
    await service.delete_test(test_id)


# complete test
# get completed tests

# get test comments
# add comment
# update comment
# delete comment