import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

pytestmark = pytest.mark.anyio


async def test_postgres_extensions_and_core_tables_exist(
    migrated_session: AsyncSession,
) -> None:
    extension_rows = await migrated_session.execute(
        text(
            "select extname from pg_extension "
            "where extname in ('vector', 'pg_trgm', 'pgcrypto')",
        ),
    )
    table_rows = await migrated_session.execute(
        text(
            "select table_name from information_schema.tables "
            "where table_schema = 'public'",
        ),
    )

    extensions = {row[0] for row in extension_rows}
    tables = {row[0] for row in table_rows}

    assert extensions == {"vector", "pg_trgm", "pgcrypto"}
    assert {"users", "contents", "content_embeddings", "job_runs"}.issubset(tables)


async def test_vector_dimension_check_is_enforced(
    migrated_session: AsyncSession,
) -> None:
    constraint_rows = await migrated_session.execute(
        text(
            "select constraint_name from information_schema.check_constraints "
            "where constraint_name = 'ck_content_embeddings_dimension'",
        ),
    )

    assert constraint_rows.scalar_one_or_none() == "ck_content_embeddings_dimension"
