from fastapi import APIRouter

from src.api.dependencies import TestsServiceDep, IAdminUser
from src.models.schemas.tests import CreateTagSchema
from src.models.schemas.update import UpdateTagSchema

router = APIRouter(tags=["Психологические тесты::Теги"], prefix="/tags")


@router.get("")
async def get_tags(service: TestsServiceDep):
    return await service.get_tags()


@router.post("")
async def add_tag(payload: CreateTagSchema, user: IAdminUser, service: TestsServiceDep):
    return await service.add_tag(payload)


@router.patch("/{tag_id}")
async def update_tag(tag_id: int, payload: UpdateTagSchema, user: IAdminUser, service: TestsServiceDep):
    return await service.update_tag(tag_id, payload)


@router.delete("/{tag_id}")
async def delete_tag(tag_id: int, user: IAdminUser, service: TestsServiceDep):
    return await service.delete_tag(tag_id)
