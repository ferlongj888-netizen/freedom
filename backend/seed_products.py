import asyncio
from decimal import Decimal

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.product import Product


PRODUCTS = [
    {
        "name": "Женский пуловер",
        "brand": "ZHRILL",
        "description": "Из 100% хлопка, с V-образным вырезом",
        "style": "Casual",
        "price": Decimal("10500.00"),
        "stock_quantity": 10,
    },
    {
        "name": "Женские джоггеры",
        "brand": "ZHRILL",
        "description": "Из высококачественного хлопка и тенселя, с карманами",
        "style": "Casual",
        "price": Decimal("15300.00"),
        "stock_quantity": 8,
    },
    {
        "name": "Женское худи Loose fit",
        "brand": "Lacoste",
        "description": "Из хлопка и полиэстера",
        "style": "Casual",
        "price": Decimal("12800.00"),
        "stock_quantity": 5,
    },
    {
        "name": "Джинсы багги",
        "brand": "XANTRAK",
        "description": "Из высококачественного денима",
        "style": "Y2K",
        "price": Decimal("8900.00"),
        "stock_quantity": 12,
    },
    {
        "name": "Шорты",
        "brand": "FEELZ",
        "description": "Из плотного денима, с карманами",
        "style": "Y2K",
        "price": Decimal("5400.00"),
        "stock_quantity": 7,
    },
    {
        "name": "Топ Crop FLZ",
        "brand": "FEELZ",
        "description": "Из хлопка и эластана",
        "style": "Y2K",
        "price": Decimal("2600.00"),
        "stock_quantity": 20,
    },
]


async def seed() -> None:
    async with AsyncSessionLocal() as db:
        existing = await db.execute(select(Product))
        if existing.scalars().first():
            print("Products already exist, skipping seed.")
            return

        for data in PRODUCTS:
            db.add(Product(**data))
        await db.commit()
        print(f"Seeded {len(PRODUCTS)} products.")


if __name__ == "__main__":
    asyncio.run(seed())