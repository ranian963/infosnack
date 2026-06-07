from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import select

from app.models import Content

if TYPE_CHECKING:
    from uuid import UUID

    from sqlalchemy.ext.asyncio import AsyncSession


class ContentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(
        self,
        *,
        workspace_id: UUID,
        content_id: UUID,
    ) -> Content | None:
        statement = select(Content).where(
            Content.id == content_id,
            Content.workspace_id == workspace_id,
            Content.deleted_at.is_(None),
        )
        return await self._session.scalar(statement)
