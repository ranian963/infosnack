from uuid import uuid4

import pytest
from app.models import Content, Workspace
from app.repositories.contents import ContentRepository
from sqlalchemy.ext.asyncio import AsyncSession

pytestmark = pytest.mark.anyio


async def test_foreign_workspace_content_is_not_returned(
    migrated_session: AsyncSession,
) -> None:
    workspace_id = uuid4()
    foreign_workspace_id = uuid4()
    workspace = Workspace(
        id=workspace_id,
        name="owned workspace",
        workspace_type="personal",
        created_by_user_id=None,
    )
    foreign_workspace = Workspace(
        id=foreign_workspace_id,
        name="foreign workspace",
        workspace_type="personal",
        created_by_user_id=None,
    )
    content = Content(
        workspace_id=foreign_workspace_id,
        created_by_user_id=None,
        title="foreign content",
        status="ready",
        content_type="article",
        read_status="unread",
    )
    migrated_session.add_all([workspace, foreign_workspace, content])
    await migrated_session.commit()

    repository = ContentRepository(migrated_session)

    found = await repository.get_by_id(
        workspace_id=workspace_id,
        content_id=content.id,
    )

    assert found is None


async def test_workspace_content_is_returned_when_scope_matches(
    migrated_session: AsyncSession,
) -> None:
    workspace_id = uuid4()
    workspace = Workspace(
        id=workspace_id,
        name="owned workspace",
        workspace_type="personal",
        created_by_user_id=None,
    )
    content = Content(
        workspace_id=workspace_id,
        created_by_user_id=None,
        title="owned content",
        status="ready",
        content_type="article",
        read_status="unread",
    )
    migrated_session.add_all([workspace, content])
    await migrated_session.commit()

    repository = ContentRepository(migrated_session)

    found = await repository.get_by_id(
        workspace_id=workspace_id,
        content_id=content.id,
    )

    assert found is not None
    assert found.id == content.id
