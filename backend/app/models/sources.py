from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
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

from app.models.base import Base, JsonMap, created_at_column, uuid_pk


class SourceDefinition(Base):
    __tablename__ = "source_definitions"
    __table_args__ = (Index("idx_source_definitions_type", "source_type", unique=True),)

    id: Mapped[UUID] = uuid_pk()
    source_type: Mapped[str] = mapped_column(String(40), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    default_config: Mapped[JsonMap] = mapped_column(
        JSONB, nullable=False, server_default="{}"
    )
    rate_limit_policy: Mapped[JsonMap | None] = mapped_column(JSONB)
    is_system: Mapped[bool] = mapped_column(nullable=False, server_default="true")
    created_at: Mapped[datetime] = created_at_column()


class Source(Base):
    __tablename__ = "sources"
    __table_args__ = (
        CheckConstraint(
            "source_type in ('rss', 'sitemap', 'site', 'arxiv', "
            "'github', 'huggingface')",
            name="ck_sources_source_type",
        ),
        CheckConstraint(
            "status in ('enabled', 'paused', 'needs_credential', 'disabled')",
            name="ck_sources_status",
        ),
        Index("idx_sources_workspace_status", "workspace_id", "status"),
        Index("idx_sources_type", "source_type"),
        Index("idx_sources_credential", "credential_id"),
        Index(
            "uq_sources_workspace_name",
            "workspace_id",
            "name",
            unique=True,
            postgresql_where=text("deleted_at is null"),
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    source_type: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="enabled"
    )
    schedule: Mapped[JsonMap | None] = mapped_column(JSONB)
    config: Mapped[JsonMap] = mapped_column(JSONB, nullable=False, server_default="{}")
    credential_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("credentials.id")
    )
    dedupe_strategy: Mapped[str | None] = mapped_column(String(80))
    failure_count: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    paused_reason: Mapped[str | None] = mapped_column(Text)
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class SourceRun(Base):
    __tablename__ = "source_runs"
    __table_args__ = (
        CheckConstraint(
            "status in ('queued', 'running', 'retrying', 'completed', "
            "'failed', 'stale', 'canceled')",
            name="ck_source_runs_status",
        ),
        Index("idx_source_runs_source_started", "source_id", "started_at"),
        Index("idx_source_runs_status", "status"),
        Index(
            "uq_source_runs_window",
            "source_id",
            "window_start",
            "window_end",
            unique=True,
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    source_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("sources.id")
    )
    job_run_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("job_runs.id")
    )
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="queued"
    )
    window_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    window_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    items_found: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    items_saved: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    redacted_error: Mapped[str | None] = mapped_column(Text)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
