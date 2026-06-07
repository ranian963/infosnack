from app.main import app
from fastapi.testclient import TestClient


def test_health_reports_service_and_dependencies() -> None:
    client = TestClient(app)

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "dependencies": {
            "api": "ok",
            "database": "degraded",
            "redis": "degraded",
            "object_storage": "degraded",
        },
    }


def test_health_cors_does_not_allow_unknown_origin() -> None:
    client = TestClient(app)

    response = client.get(
        "/api/health",
        headers={"Origin": "http://evil.localhost:3000"},
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") != "*"
