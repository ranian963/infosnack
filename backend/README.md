# InfoSnack Backend

FastAPI backend scaffold for InfoSnack.

## Local Commands

```bash
uv run uvicorn app.main:app --reload --port 8001 --reload-dir app
uv run ruff check .
uv run pytest
uv run pytest --cov=app --cov-report=term-missing
```

## Environment

Use the repo-root `.env` as the local source of truth:

```bash
ln -s ../.env backend/.env
```
