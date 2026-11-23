from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.enums import OrderStatus

async def create_order_from_cart(db: AsyncSession, user_id: int) -> Order:
    stmt = select(CartItem).where(CartItem.user_id == user_id).options(selectinload(CartItem.product))
    result = await db.execute(stmt)
    cart_items = result.scalars().all()

    if not cart_items:
        raise ValueError("Cart is empty")

    order = Order(user_id=user_id, status=OrderStatus.CREATED, total_price=Decimal("0.00"))
    db.add(order)
    await db.flush() 

    total = Decimal("0.00")

    for item in cart_items:
        product = item.product
        if product.stock_quantity < item.quantity:
            raise ValueError(f"Not enough stock for {product.name}")

        product.stock_quantity -= item.quantity
        price = Decimal(str(product.price))
        total += price * item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            size=item.size,
            quantity=item.quantity,
            price_at_moment=price
        )
        db.add(order_item)
        await db.delete(item)

    order.total_price = total
    await db.commit()
    
    stmt = (
        select(Order)
        .where(Order.id == order.id)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
    )
    res = await db.execute(stmt)
    return res.scalars().first()

async def get_user_orders(db: AsyncSession, user_id: int) -> list[Order]:
    stmt = (
        select(Order)
        .where(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .options(selectinload(Order.items).selectinload(OrderItem.product))
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())