from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


async def get_product(db: AsyncSession, product_id: int) -> Product | None:
    return await db.get(Product, product_id)


async def list_products(
    db: AsyncSession,
    brand: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Product]:
    stmt = select(Product)

    if brand:
        stmt = stmt.where(Product.brand == brand)
    if min_price is not None:
        stmt = stmt.where(Product.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Product.price <= max_price)
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            (Product.name.ilike(pattern))
            | (Product.brand.ilike(pattern))
            | (Product.description.ilike(pattern))
            | (Product.style.ilike(pattern))
        )

    stmt = stmt.order_by(Product.id).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_product(db: AsyncSession, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update_product(
    db: AsyncSession, product: Product, data: ProductUpdate
) -> Product:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return product


async def delete_product(db: AsyncSession, product: Product) -> None:
    await db.delete(product)
    await db.commit()