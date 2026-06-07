from fastapi import APIRouter

from app.schemas.health import DependencyStatus, HealthResponse, HealthStatus

router = APIRouter(prefix="/api", tags=["System"])


@router.get(
    "/health",
    operation_id="getHealth",
    summary="Check API and dependency health.",
)
def get_health() -> HealthResponse:
    return HealthResponse(
        status=HealthStatus.OK,
        dependencies={
            "api": DependencyStatus.OK,
            "database": DependencyStatus.DEGRADED,
            "redis": DependencyStatus.DEGRADED,
            "object_storage": DependencyStatus.DEGRADED,
        },
    )
