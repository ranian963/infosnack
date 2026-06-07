from collections.abc import AsyncIterator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from app.core.config import get_settings
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture(scope="session")
def alembic_config() -> Config:
    backend_root = Path(__file__).resolve().parents[1]
    config = Config(str(backend_root / "alembic.ini"))
    config.set_main_option("script_location", str(backend_root / "alembic"))
    return config


@pytest.fixture
def migrated_database(alembic_config: Config) -> None:
    command.upgrade(alembic_config, "head")


@pytest.fixture
async def migrated_session(
    migrated_database: None,
) -> AsyncIterator[AsyncSession]:
    _ = migrated_database
    settings = get_settings()
    engine = create_async_engine(settings.database_url, pool_pre_ping=True)
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)

    async with sessionmaker() as session:
        yield session
        await session.rollback()
        await session.execute(
            text(
                "truncate table "
                "llm_usage, audit_events, job_runs, notification_deliveries, "
                "notifications, webhook_subscriptions, export_jobs, share_links, "
                "digest_items, digests, message_events, chat_messages, chat_threads, "
                "source_runs, sources, source_definitions, content_tags, tags, "
                "collection_items, collections, search_documents, content_embeddings, "
                "content_chunks, assets, content_versions, contents, captures, "
                "credentials, refresh_tokens, invitations, workspace_memberships, "
                "workspaces, users restart identity cascade",
            ),
        )
        await session.commit()

    await engine.dispose()
