from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pgvector.sqlalchemy import Vector
from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, TSVECTOR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, JsonMap, created_at_column, updated_at_column, uuid_pk


class ContentChunk(Base):
    __tablename__ = "content_chunks"
    __table_args__ = (
        Index("idx_chunks_content_index", "content_id", "chunk_index"),
        Index("idx_chunks_workspace", "workspace_id"),
        Index(
            "uq_chunks_content_version_index",
            "content_id",
            "version_id",
            "chunk_index",
            unique=True,
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    content_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    version_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("content_versions.id")
    )
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    source_location: Mapped[JsonMap | None] = mapped_column(JSONB)
    text_hash: Mapped[str | None] = mapped_column(String(128))
    token_count: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = created_at_column()


class ContentEmbedding(Base):
    __tablename__ = "content_embeddings"
    __table_args__ = (
        CheckConstraint(
            "embedding_dimension = 1536", name="ck_content_embeddings_dimension"
        ),
        Index(
            "idx_embeddings_model_dimension", "embedding_model", "embedding_dimension"
        ),
        Index(
            "idx_content_embeddings_vector_hnsw",
            "vector",
            postgresql_using="hnsw",
            postgresql_ops={"vector": "vector_cosine_ops"},
        ),
        Index(
            "uq_embeddings_chunk_model_dimension",
            "chunk_id",
            "embedding_model",
            "embedding_dimension",
            unique=True,
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    chunk_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("content_chunks.id")
    )
    embedding_model: Mapped[str] = mapped_column(String(160), nullable=False)
    embedding_model_version: Mapped[str | None] = mapped_column(String(120))
    embedding_dimension: Mapped[int] = mapped_column(Integer, nullable=False)
    vector: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
    provider: Mapped[str] = mapped_column(String(80), nullable=False)
    created_at: Mapped[datetime] = created_at_column()


class SearchDocument(Base):
    __tablename__ = "search_documents"
    __table_args__ = (
        Index("idx_search_documents_tsvector", "tsvector_body", postgresql_using="gin"),
        Index(
            "idx_search_documents_trigram_title",
            "trigram_title",
            postgresql_using="gin",
            postgresql_ops={"trigram_title": "gin_trgm_ops"},
        ),
        Index(
            "uq_search_documents_content_version",
            "content_id",
            "version_id",
            unique=True,
        ),
    )

    id: Mapped[UUID] = uuid_pk()
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("workspaces.id")
    )
    content_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("contents.id")
    )
    version_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("content_versions.id")
    )
    tsvector_body: Mapped[str | None] = mapped_column(TSVECTOR)
    trigram_title: Mapped[str | None] = mapped_column(Text)
    updated_at: Mapped[datetime] = updated_at_column()
