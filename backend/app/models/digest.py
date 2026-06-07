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
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, JsonMap, created_at_column, uuid_pk


class Digest(Base):
    __tablename__ = "digests"
    __table_args__ = (
        CheckConstraint(
            "type in ('daily', 'weekly', 'source', 'topic', 'manual')",
            name="ck_digests_type",
        ),
        CheckConstraint(
            "status in ('draft', 'generating', 'ready', 'published', 'failed')",
            name="ck_digests_status",
        ),
        Index("idx_digests_workspace_status", "workspace_id", "status"),
        Index("idx_digests_published", "published_at"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    type: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str | None] = mapped_column(Text)
    schedule: Mapped[JsonMap | None] = mapped_column(JSONB)
    query: Mapped[JsonMap | None] = mapped_column(JSONB)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    created_at: Mapped[datetime] = created_at_column()


class DigestItem(Base):
    __tablename__ = "digest_items"
    __table_args__ = (
        Index("idx_digest_items_digest_rank", "digest_id", "rank"),
        Index("uq_digest_items_digest_content", "digest_id", "content_id", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    digest_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("digests.id")
    )
    content_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    rank: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    reason: Mapped[str | None] = mapped_column(Text)
    curator_comment: Mapped[str | None] = mapped_column(Text)
    included: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="true"
    )
    created_at: Mapped[datetime] = created_at_column()


class ShareLink(Base):
    __tablename__ = "share_links"
    __table_args__ = (
        CheckConstraint(
            "target_type in ('content', 'collection', 'digest')",
            name="ck_share_links_target_type",
        ),
        CheckConstraint(
            "scope in ('summary_only', 'summary_and_extracted_text', 'digest_only')",
            name="ck_share_links_scope",
        ),
        Index("idx_share_token_hash", "token_hash", unique=True),
        Index(
            "idx_shares_workspace_target", "workspace_id", "target_type", "target_id"
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    target_type: Mapped[str] = mapped_column(String(40), nullable=False)
    target_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(160), nullable=False)
    scope: Mapped[str] = mapped_column(String(80), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    noindex: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="true"
    )
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    last_viewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )


class ExportJob(Base):
    __tablename__ = "export_jobs"
    __table_args__ = (
        CheckConstraint("format = 'markdown'", name="ck_export_jobs_format"),
        Index("idx_export_jobs_workspace_created", "workspace_id", "created_at"),
        Index("idx_export_jobs_job", "job_run_id"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    job_run_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("job_runs.id")
    )
    scope: Mapped[JsonMap] = mapped_column(JSONB, nullable=False)
    format: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="markdown"
    )
    object_key: Mapped[str | None] = mapped_column(Text)
    includes_assets: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="false"
    )
    signed_url_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    created_at: Mapped[datetime] = created_at_column()


class WebhookSubscription(Base):
    __tablename__ = "webhook_subscriptions"
    __table_args__ = (
        CheckConstraint(
            "target_kind in ('custom', 'google_chat_incoming')",
            name="ck_webhook_subscriptions_target_kind",
        ),
        CheckConstraint(
            "status in ('enabled', 'disabled', 'failed')", name="ck_webhooks_status"
        ),
        CheckConstraint(
            "(target_kind = 'custom' and signing_secret_hash is not null) or "
            "(target_kind = 'google_chat_incoming')",
            name="ck_webhooks_custom_secret",
        ),
        Index("idx_webhooks_workspace_status", "workspace_id", "status"),
        Index(
            "idx_webhooks_events",
            "events",
            postgresql_using="gin",
        ),
        Index("idx_webhooks_workspace_target_kind", "workspace_id", "target_kind"),
        Index(
            "uq_webhooks_workspace_name",
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
    target_url: Mapped[str] = mapped_column(Text, nullable=False)
    target_kind: Mapped[str] = mapped_column(String(40), nullable=False)
    events: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False)
    signing_secret_hash: Mapped[str | None] = mapped_column(String(160))
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="enabled"
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_failure_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (
        Index("idx_notifications_user_read", "user_id", "read_at"),
        Index("idx_notifications_workspace_created", "workspace_id", "created_at"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    type: Mapped[str] = mapped_column(String(80), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    target_type: Mapped[str | None] = mapped_column(String(80))
    target_id: Mapped[UUID | None] = mapped_column(PG_UUID(as_uuid=True))
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_column()


class NotificationDelivery(Base):
    __tablename__ = "notification_deliveries"
    __table_args__ = (
        CheckConstraint(
            "channel in ('in_app', 'webhook')",
            name="ck_notification_deliveries_channel",
        ),
        CheckConstraint(
            "status in ('queued', 'sending', 'delivered', 'failed', 'canceled')",
            name="ck_notification_deliveries_status",
        ),
        Index("idx_notification_deliveries_status", "status"),
        Index("idx_notification_deliveries_notification", "notification_id"),
        Index("idx_notification_deliveries_webhook", "webhook_subscription_id"),
    )

    id: Mapped[UUID] = uuid_pk()
    notification_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("notifications.id")
    )
    webhook_subscription_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("webhook_subscriptions.id"),
    )
    channel: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    redacted_payload: Mapped[JsonMap | None] = mapped_column(JSONB)
    provider_message_id: Mapped[str | None] = mapped_column(String(160))
    attempt_count: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0"
    )
    last_error: Mapped[str | None] = mapped_column(Text)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_column()
