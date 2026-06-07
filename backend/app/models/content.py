from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, JsonMap, created_at_column, updated_at_column, uuid_pk

PIPELINE_STATUSES = (
    "'queued', 'fetching', 'extracting', 'normalizing', 'deduplicating', "
    "'ai_processing', 'indexing', 'ready', 'needs_review', 'failed'"
)


class Capture(Base):
    __tablename__ = "captures"
    __table_args__ = (
        CheckConstraint(
            "input_type in ('url', 'text', 'file')", name="ck_captures_input_type"
        ),
        CheckConstraint(f"status in ({PIPELINE_STATUSES})", name="ck_captures_status"),
        Index("idx_captures_workspace_status", "workspace_id", "status"),
        Index("idx_captures_content", "content_id"),
        Index(
            "uq_captures_idempotency",
            "workspace_id",
            "idempotency_key",
            "request_hash",
            unique=True,
            postgresql_where=text("idempotency_key is not null"),
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    input_type: Mapped[str] = mapped_column(String(16), nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="queued"
    )
    failure_code: Mapped[str | None] = mapped_column(String(80))
    failure_message: Mapped[str | None] = mapped_column(Text)
    idempotency_key: Mapped[str | None] = mapped_column(String(160))
    request_hash: Mapped[str | None] = mapped_column(String(128))
    source_url: Mapped[str | None] = mapped_column(Text)
    content_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    created_at: Mapped[datetime] = created_at_column()
    updated_at: Mapped[datetime] = updated_at_column()


class Content(Base):
    __tablename__ = "contents"
    __table_args__ = (
        CheckConstraint(
            f"status in ({PIPELINE_STATUSES}, 'archived', 'deleted')",
            name="ck_contents_status",
        ),
        CheckConstraint(
            "content_type in ('article', 'paper', 'video', 'note', "
            "'image', 'document', 'other')",
            name="ck_contents_content_type",
        ),
        CheckConstraint(
            "read_status in ('unread', 'read', 'archived')",
            name="ck_contents_read_status",
        ),
        Index("idx_contents_workspace_saved", "workspace_id", "saved_at"),
        Index("idx_contents_workspace_status", "workspace_id", "status"),
        Index("idx_contents_workspace_type", "workspace_id", "content_type"),
        Index("idx_contents_source", "source_id"),
        Index(
            "uq_contents_canonical_url_hash",
            "workspace_id",
            "canonical_url_hash",
            unique=True,
            postgresql_where=text("canonical_url_hash is not null"),
        ),
        Index(
            "uq_contents_content_hash",
            "workspace_id",
            "content_hash",
            unique=True,
            postgresql_where=text("content_hash is not null"),
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    capture_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("captures.id")
    )
    source_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("sources.id")
    )
    title: Mapped[str | None] = mapped_column(Text)
    source_url: Mapped[str | None] = mapped_column(Text)
    canonical_url_hash: Mapped[str | None] = mapped_column(String(128))
    content_hash: Mapped[str | None] = mapped_column(String(128))
    domain: Mapped[str | None] = mapped_column(String(255))
    thumbnail_url: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="queued"
    )
    content_type: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="article"
    )
    language: Mapped[str | None] = mapped_column(String(16))
    read_status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="unread"
    )
    favorite: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="false"
    )
    saved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("now()")
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ContentVersion(Base):
    __tablename__ = "content_versions"
    __table_args__ = (
        Index("idx_content_versions_content", "content_id"),
        Index(
            "uq_content_versions_content_version", "content_id", "version", unique=True
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    content_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    extracted_markdown: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[str | None] = mapped_column(Text)
    one_line_summary: Mapped[str | None] = mapped_column(Text)
    key_points: Mapped[JsonMap | None] = mapped_column(JSONB)
    entities: Mapped[JsonMap | None] = mapped_column(JSONB)
    version_metadata: Mapped[JsonMap | None] = mapped_column("metadata", JSONB)
    prompt_version: Mapped[str | None] = mapped_column(String(80))
    model_id: Mapped[str | None] = mapped_column(String(160))
    created_at: Mapped[datetime] = created_at_column()


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (
        CheckConstraint(
            "asset_type in ('raw', 'original', 'thumbnail', 'extracted_image', "
            "'ocr_intermediate', 'export_zip')",
            name="ck_assets_asset_type",
        ),
        Index("idx_assets_content", "content_id"),
        Index("idx_assets_workspace_sha", "workspace_id", "sha256"),
        Index(
            "uq_assets_workspace_sha",
            "workspace_id",
            "sha256",
            unique=True,
            postgresql_where=text("sha256 is not null"),
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    content_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    capture_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("captures.id")
    )
    asset_type: Mapped[str] = mapped_column(String(32), nullable=False)
    object_key: Mapped[str] = mapped_column(Text, nullable=False)
    mime_type: Mapped[str | None] = mapped_column(String(160))
    size_bytes: Mapped[int | None] = mapped_column(Integer)
    sha256: Mapped[str | None] = mapped_column(String(128))
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = created_at_column()
    purged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
