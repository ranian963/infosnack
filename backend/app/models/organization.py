from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, created_at_column, uuid_pk


class Collection(Base):
    __tablename__ = "collections"
    __table_args__ = (
        Index("idx_collections_workspace", "workspace_id"),
        Index("uq_collections_workspace_slug", "workspace_id", "slug", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), nullable=False)
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    created_at: Mapped[datetime] = created_at_column()
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class CollectionItem(Base):
    __tablename__ = "collection_items"
    __table_args__ = (
        Index("idx_collection_items_collection_rank", "collection_id", "rank"),
        Index(
            "uq_collection_items_collection_content",
            "collection_id",
            "content_id",
            unique=True,
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    collection_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("collections.id")
    )
    content_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    added_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    rank: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = created_at_column()


class Tag(Base):
    __tablename__ = "tags"
    __table_args__ = (
        Index("idx_tags_workspace_slug", "workspace_id", "slug"),
        Index("uq_tags_workspace_slug", "workspace_id", "slug", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    slug: Mapped[str] = mapped_column(String(180), nullable=False)
    display_name: Mapped[str] = mapped_column(String(180), nullable=False)
    created_at: Mapped[datetime] = created_at_column()


class ContentTag(Base):
    __tablename__ = "content_tags"
    __table_args__ = (
        CheckConstraint(
            "source in ('ai', 'user', 'source')", name="ck_content_tags_source"
        ),
        Index("idx_content_tags_tag", "tag_id"),
        Index("idx_content_tags_content", "content_id"),
        Index("uq_content_tags_content_tag", "content_id", "tag_id", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    content_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    tag_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("tags.id"))
    source: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = created_at_column()
