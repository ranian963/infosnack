from __future__ import annotations

from typing import TYPE_CHECKING

from app.models import Base

if TYPE_CHECKING:
    from collections.abc import Mapping

    from sqlalchemy import MetaData


REQUIRED_COLUMNS: Mapping[str, frozenset[str]] = {
    "users": frozenset(
        {
            "id",
            "email",
            "email_normalized",
            "password_hash",
            "name",
            "is_super_admin",
            "created_at",
            "deleted_at",
        },
    ),
    "workspaces": frozenset({"id", "name", "workspace_type", "created_by_user_id"}),
    "workspace_memberships": frozenset({"workspace_id", "user_id", "role", "status"}),
    "credentials": frozenset(
        {"workspace_id", "scope", "provider", "encrypted_payload", "key_id"},
    ),
    "captures": frozenset(
        {"workspace_id", "created_by_user_id", "input_type", "status", "content_id"},
    ),
    "contents": frozenset(
        {"workspace_id", "created_by_user_id", "status", "content_type", "read_status"},
    ),
    "content_embeddings": frozenset(
        {"chunk_id", "embedding_dimension", "vector", "provider"},
    ),
    "search_documents": frozenset(
        {"workspace_id", "content_id", "tsvector_body", "trigram_title"},
    ),
    "sources": frozenset({"workspace_id", "source_type", "status", "credential_id"}),
    "message_events": frozenset({"run_id", "sequence", "event_type", "payload"}),
    "webhook_subscriptions": frozenset(
        {"workspace_id", "target_kind", "events", "signing_secret_hash", "status"},
    ),
    "job_runs": frozenset(
        {"workspace_id", "queue", "status", "idempotency_key", "heartbeat_at"},
    ),
    "audit_events": frozenset(
        {"workspace_id", "actor_user_id", "action", "metadata_redacted"},
    ),
    "llm_usage": frozenset(
        {"workspace_id", "provider", "model_id", "input_tokens", "output_tokens"},
    ),
}


REQUIRED_TABLES = frozenset(
    {
        "users",
        "workspaces",
        "workspace_memberships",
        "invitations",
        "refresh_tokens",
        "credentials",
        "captures",
        "contents",
        "content_versions",
        "assets",
        "content_chunks",
        "content_embeddings",
        "search_documents",
        "collections",
        "collection_items",
        "tags",
        "content_tags",
        "source_definitions",
        "sources",
        "source_runs",
        "chat_threads",
        "chat_messages",
        "message_events",
        "digests",
        "digest_items",
        "share_links",
        "export_jobs",
        "webhook_subscriptions",
        "notifications",
        "notification_deliveries",
        "job_runs",
        "audit_events",
        "llm_usage",
    },
)


def test_appendix_a_tables_are_registered_on_metadata() -> None:
    metadata: MetaData = Base.metadata

    missing_tables = REQUIRED_TABLES.difference(metadata.tables)

    assert missing_tables == frozenset()


def test_appendix_a_required_columns_are_registered_on_metadata() -> None:
    metadata: MetaData = Base.metadata

    missing_columns = {
        table_name: required_columns.difference(
            set(metadata.tables[table_name].columns.keys()),
        )
        for table_name, required_columns in REQUIRED_COLUMNS.items()
        if required_columns.difference(set(metadata.tables[table_name].columns.keys()))
    }

    assert missing_columns == {}


def test_appendix_c_status_checks_are_named_and_attached() -> None:
    metadata: MetaData = Base.metadata

    check_names = {
        constraint.name
        for table in metadata.tables.values()
        for constraint in table.constraints
        if constraint.name is not None
    }

    assert "ck_contents_status" in check_names
    assert "ck_contents_content_type" in check_names
    assert "ck_job_runs_status" in check_names
    assert "ck_webhook_subscriptions_target_kind" in check_names
