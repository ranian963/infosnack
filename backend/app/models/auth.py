from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, created_at_column, short_text, uuid_pk


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "email_normalized = lower(email_normalized)",
            name="ck_users_email_lowercase",
        ),
        Index("idx_users_email_normalized", "email_normalized", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    email: Mapped[str] = mapped_column(short_text(), nullable=False)
    email_normalized: Mapped[str] = mapped_column(short_text(), nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(short_text(160), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(Text)
    locale: Mapped[str] = mapped_column(String(16), nullable=False, server_default="ko")
    is_super_admin: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="false"
    )
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_column()
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Workspace(Base):
    __tablename__ = "workspaces"
    __table_args__ = (
        CheckConstraint(
            "workspace_type in ('personal', 'team')", name="ck_workspaces_type"
        ),
        Index("idx_workspaces_created_by", "created_by_user_id"),
    )

    id: Mapped[UUID] = uuid_pk()
    name: Mapped[str] = mapped_column(short_text(), nullable=False)
    workspace_type: Mapped[str] = mapped_column(String(32), nullable=False)
    default_language: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default="ko"
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_column()


class WorkspaceMembership(Base):
    __tablename__ = "workspace_memberships"
    __table_args__ = (
        CheckConstraint(
            "role in ('owner', 'admin', 'member', 'viewer')", name="ck_members_role"
        ),
        CheckConstraint("status in ('active', 'disabled')", name="ck_members_status"),
        Index("idx_members_user", "user_id"),
        Index("idx_members_workspace_role", "workspace_id", "role"),
        Index("uq_members_workspace_user", "workspace_id", "user_id", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    role: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="active"
    )
    created_at: Mapped[datetime] = created_at_column()


class Invitation(Base):
    __tablename__ = "invitations"
    __table_args__ = (
        CheckConstraint(
            "role in ('owner', 'admin', 'member', 'viewer')", name="ck_invitations_role"
        ),
        CheckConstraint(
            "status in ('pending', 'used', 'expired', 'revoked')",
            name="ck_invitations_status",
        ),
        Index("idx_invitation_token_hash", "token_hash", unique=True),
        Index("idx_invitations_workspace_status", "workspace_id", "status"),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    email_normalized: Mapped[str] = mapped_column(short_text(), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False)
    token_hash: Mapped[str] = mapped_column(short_text(), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    __table_args__ = (
        Index("idx_refresh_user_family", "user_id", "family_id"),
        Index("idx_refresh_token_hash", "token_hash", unique=True),
    )

    id: Mapped[UUID] = uuid_pk()
    user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    token_hash: Mapped[str] = mapped_column(short_text(), nullable=False)
    family_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False)
    rotated_from_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("refresh_tokens.id")
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    replay_detected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
