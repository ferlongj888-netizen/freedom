from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import product as product_crud
from app.db.session import get_db
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductRead])
async def list_products(
    brand: str | None = None,
    min_price: Decimal | None = Query(default=None, ge=0),
    max_price: Decimal | None = Query(default=None, ge=0),
    search: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
) -> list[ProductRead]:
    products = await product_crud.list_products(
        db,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
        search=search,
        skip=skip,
        limit=limit,
    )
    return products


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    product = await product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    return await product_crud.create_product(db, data)


@router.put("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    product = await product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return await product_crud.update_product(db, product, data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    product = await product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    await product_crud.delete_product(db, product)