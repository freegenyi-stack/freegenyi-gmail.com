from fastapi import FastAPI
from apps.api.src.interface_adapters.controllers import health_controller, user_controller

def create_app() -> FastAPI:
    app = FastAPI(
        title="FreeGeny API",
        description="Scalable EdTech SaaS Platform API",
        version="0.1.0",
    )

    # Register routers
    app.include_router(health_controller.router)
    app.include_router(user_controller.router)

    @app.get("/")
    async def root():
        return {"message": "Welcome to FreeGeny API", "status": "running"}

    return app
