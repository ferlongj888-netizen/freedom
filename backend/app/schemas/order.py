from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.enums import OrderStatus
from app.schemas.product import ProductRead

class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    product_id: int | None
    product_name: str
    size: str
    quantity: int
    price_at_moment: float
    product: ProductRead | None = None

class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    status: OrderStatus
    total_price: float
    created_at: datetime
    items: list[OrderItemRead]