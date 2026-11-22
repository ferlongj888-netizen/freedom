from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart_item import CartItem
from app.schemas.cart import CartItemCreate

async def get_cart_items(db: AsyncSession, user_id: int) -> list[CartItem]:
    stmt = (
        select(CartItem)
        .where(CartItem.user_id == user_id)
        .options(selectinload(CartItem.product)) 
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def add_to_cart(db: AsyncSession, user_id: int, data: CartItemCreate) -> CartItem:
    stmt = select(CartItem).where(
        CartItem.user_id == user_id,
        CartItem.product_id == data.product_id,
        CartItem.size == data.size,
    )
    result = await db.execute(stmt)
    existing_item = result.scalars().first()

    if existing_item:
        existing_item.quantity += data.quantity
        await db.commit()
        await db.refresh(existing_item)
        return existing_item

    new_item = CartItem(
        user_id=user_id,
        product_id=data.product_id,
        size=data.size,
        quantity=data.quantity,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

async def update_cart_item(db: AsyncSession, item_id: int, user_id: int, quantity: int) -> CartItem | None:
    stmt = (
        select(CartItem)
        .where(CartItem.id == item_id, CartItem.user_id == user_id)
        .options(selectinload(CartItem.product))
    )
    result = await db.execute(stmt)
    item = result.scalars().first()

    if not item:
        return None
    
    item.quantity = quantity
    await db.commit()
    await db.refresh(item)
    return item

async def remove_cart_item(db: AsyncSession, item_id: int, user_id: int) -> bool:
    item = await db.get(CartItem, item_id)
    if not item or item.user_id != user_id:
        return False
    
    await db.delete(item)
    await db.commit()
    return True