import logging
from typing import Final

import structlog

LOG_LEVEL: Final[str] = "INFO"


def configure_logging() -> None:
    logging.basicConfig(level=LOG_LEVEL, format="%(message)s")
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        cache_logger_on_first_use=True,
    )
