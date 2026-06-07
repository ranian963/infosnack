from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    LargeBinary,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, updated_at_column, uuid_pk


class Credential(Base):
    __tablename__ = "credentials"
    __table_args__ = (
        CheckConstraint(
            "scope in ('workspace', 'system')", name="ck_credentials_scope"
        ),
        CheckConstraint(
            "rotation_status in ('active', 'rotation_due', 'rotating')",
            name="ck_credentials_rotation_status",
        ),
        CheckConstraint(
            "(scope = 'system' and workspace_id is null) or "
            "(scope = 'workspace' and workspace_id is not null)",
            name="ck_credentials_scope_workspace",
        ),
        Index("idx_credentials_workspace_provider", "workspace_id", "provider"),
        Index("idx_credentials_scope_provider", "scope", "provider"),
        Index(
            "uq_credentials_workspace_name",
            "workspace_id",
            "name",
            unique=True,
            postgresql_where=text("scope = 'workspace' and deleted_at is null"),
        ),
        Index(
            "uq_credentials_system_provider_name",
            "provider",
            "name",
            unique=True,
            postgresql_where=text("scope = 'system'"),
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    scope: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    provider: Mapped[str] = mapped_column(String(80), nullable=False)
    encrypted_payload: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    field_keys: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False)
    key_id: Mapped[str] = mapped_column(String(120), nullable=False)
    rotation_status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="active"
    )
    created_by_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id")
    )
    updated_at: Mapped[datetime] = updated_at_column()
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
