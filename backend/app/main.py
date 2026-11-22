from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, cart, products
from app.core.config import settings

app = FastAPI(title="Freedom API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(auth.router)
app.include_router(cart.router)

@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "ok"}