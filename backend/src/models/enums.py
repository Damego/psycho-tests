from enum import IntFlag, IntEnum


class UserPermissions(IntFlag):
    NONE = 0
    ADMINISTRATOR = 1 << 0


class TestStatus(IntEnum):
    DRAFT = 0
    PUBLISHED = 1
    CLOSED = 2