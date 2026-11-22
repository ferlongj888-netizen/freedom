from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.crud import cart as cart_crud
from app.db.session import get_db
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemRead, CartItemUpdate

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("", response_model=list[CartItemRead])
async def get_my_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await cart_crud.get_cart_items(db, current_user.id)

@router.post("", response_model=CartItemRead, status_code=status.HTTP_201_CREATED)
async def add_item(
    data: CartItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await cart_crud.add_to_cart(db, current_user.id, data)

@router.put("/{item_id}", response_model=CartItemRead)
async def update_item(
    item_id: int,
    data: CartItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = await cart_crud.update_cart_item(db, item_id, current_user.id, data.quantity)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = await cart_crud.remove_cart_item(db, item_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")