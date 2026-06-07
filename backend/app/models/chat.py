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
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, JsonMap, created_at_column, uuid_pk


class ChatThread(Base):
    __tablename__ = "chat_threads"
    __table_args__ = (
        CheckConstraint(
            "scope in ('current_content', 'library', 'collection', 'compare')",
            name="ck_chat_threads_scope",
        ),
        Index("idx_chat_threads_workspace_created", "workspace_id", "created_at"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    scope: Mapped[str] = mapped_column(String(40), nullable=False)
    content_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    collection_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("collections.id")
    )
    title: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at_column()
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    __table_args__ = (
        CheckConstraint(
            "role in ('user', 'assistant', 'system', 'tool')",
            name="ck_chat_messages_role",
        ),
        CheckConstraint(
            "status in ('running', 'completed', 'partial', 'failed', 'canceled')",
            name="ck_chat_messages_status",
        ),
        Index("idx_chat_messages_thread_created", "thread_id", "created_at"),
        Index("idx_chat_messages_run", "run_id"),
    )

    id: Mapped[UUID] = uuid_pk()
    thread_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("chat_threads.id")
    )
    role: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    citations: Mapped[JsonMap | None] = mapped_column(JSONB)
    run_id: Mapped[str | None] = mapped_column(String(160))
    created_at: Mapped[datetime] = created_at_column()


class MessageEvent(Base):
    __tablename__ = "message_events"
    __table_args__ = (
        CheckConstraint(
            "event_type in ('metadata', 'delta', 'citation', 'done', 'error')",
            name="ck_message_events_event_type",
        ),
        Index("idx_message_events_run_sequence", "run_id", "sequence"),
        Index("uq_message_events_run_sequence", "run_id", "sequence", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    thread_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("chat_threads.id")
    )
    message_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("chat_messages.id")
    )
    run_id: Mapped[str] = mapped_column(String(160), nullable=False)
    sequence: Mapped[int] = mapped_column(Integer, nullable=False)
    event_type: Mapped[str] = mapped_column(String(32), nullable=False)
    payload: Mapped[JsonMap] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = created_at_column()
