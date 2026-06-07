from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, JsonMap, created_at_column, uuid_pk


class JobRun(Base):
    __tablename__ = "job_runs"
    __table_args__ = (
        CheckConstraint(
            "queue in ('ingest', 'ai', 'embedding', 'source', "
            "'digest', 'export', 'maintenance')",
            name="ck_job_runs_queue",
        ),
        CheckConstraint(
            "status in ('queued', 'running', 'retrying', 'completed', "
            "'failed', 'stale', 'canceled')",
            name="ck_job_runs_status",
        ),
        Index("idx_job_runs_queue_status", "queue", "status"),
        Index("idx_job_runs_heartbeat", "heartbeat_at"),
        Index("idx_job_runs_target", "target_type", "target_id"),
        Index(
            "uq_job_runs_queue_idempotency",
            "queue",
            "idempotency_key",
            unique=True,
            postgresql_where=text("idempotency_key is not null"),
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    queue: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    idempotency_key: Mapped[str | None] = mapped_column(String(180))
    target_type: Mapped[str | None] = mapped_column(String(80))
    target_id: Mapped[UUID | None] = mapped_column(PG_UUID(as_uuid=True))
    heartbeat_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    retry_count: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    redacted_error: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at_column()
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AuditEvent(Base):
    __tablename__ = "audit_events"
    __table_args__ = (
        Index("idx_audit_workspace_created", "workspace_id", "created_at"),
        Index("idx_audit_target", "target_type", "target_id"),
        Index("idx_audit_actor", "actor_user_id", "actor_type"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    actor_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    actor_type: Mapped[str] = mapped_column(String(80), nullable=False)
    action: Mapped[str] = mapped_column(String(120), nullable=False)
    target_type: Mapped[str | None] = mapped_column(String(80))
    target_id: Mapped[UUID | None] = mapped_column(PG_UUID(as_uuid=True))
    metadata_redacted: Mapped[JsonMap] = mapped_column(
        JSONB, nullable=False, server_default="{}"
    )
    request_id: Mapped[str | None] = mapped_column(String(120))
    created_at: Mapped[datetime] = created_at_column()


class LlmUsage(Base):
    __tablename__ = "llm_usage"
    __table_args__ = (
        CheckConstraint("input_tokens >= 0", name="ck_llm_usage_input_tokens"),
        CheckConstraint("output_tokens >= 0", name="ck_llm_usage_output_tokens"),
        CheckConstraint("cost_estimate >= 0", name="ck_llm_usage_cost_estimate"),
        Index("idx_llm_usage_workspace_created", "workspace_id", "created_at"),
        Index("idx_llm_usage_provider_model", "provider", "model_id"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    content_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    job_run_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("job_runs.id")
    )
    provider: Mapped[str] = mapped_column(String(80), nullable=False)
    model_id: Mapped[str] = mapped_column(String(160), nullable=False)
    prompt_version: Mapped[str | None] = mapped_column(String(80))
    input_tokens: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    output_tokens: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    cost_estimate: Mapped[Decimal] = mapped_column(
        Numeric(12, 6), nullable=False, server_default="0"
    )
    credential_source: Mapped[str | None] = mapped_column(String(80))
    created_at: Mapped[datetime] = created_at_column()
